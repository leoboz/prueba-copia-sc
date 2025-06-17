
import { supabase } from "@/integrations/supabase/client";
import { Sample } from "@/types";

export type SampleLabel = {
  id: string;
  name: string;
  description?: string;
};

export const fetchSampleLabels = async (): Promise<SampleLabel[] | null> => {
  try {
    const { data, error } = await supabase
      .from("sample_labels")
      .select("id, name, description");
    
    if (error) {
      console.error("Error fetching sample labels:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchSampleLabels:", error);
    return null;
  }
};

export const determineCombinedLabel = (
  parameterLabels: { test_result_id: string; label_id: string }[],
  availableLabels: SampleLabel[] | null | undefined,
): string | null => {
  if (!parameterLabels || parameterLabels.length === 0) {
    console.log("No parameter labels provided, defaulting to Retenido");
    const defaultLabel = availableLabels?.find((label) => label.name === "Retenido")?.id || null;
    return defaultLabel;
  }
  
  const labelIdsToNames: Record<string, string> = {};
  availableLabels?.forEach((label) => {
    labelIdsToNames[label.id] = label.name;
  });
  
  const labelNames = parameterLabels.map(label => labelIdsToNames[label.label_id]).filter(Boolean);
  console.log("🏷️ Combined label calculation - All label names:", labelNames);
  
  // FIXED: Use exact database label names and proper priority logic
  if (labelNames.includes("Retenido")) {
    console.log("Found Retenido label, using it as combined label");
    return availableLabels?.find((label) => label.name === "Retenido")?.id || null;
  }
  
  // Check for both possible Standard label names
  if (labelNames.includes("Calidad Standard") || labelNames.includes("Standard")) {
    console.log("Found Standard/Calidad Standard label, using it as combined label");
    const standardLabel = availableLabels?.find((label) => 
      label.name === "Calidad Standard" || label.name === "Standard"
    )?.id || null;
    return standardLabel;
  }
  
  // Check for both possible Superior label names - ALL must be superior for sample to be superior
  const allSuperior = labelNames.every((name) => 
    name === "Calidad Superior" || name === "Superior"
  ) && labelNames.length > 0;
  
  if (allSuperior) {
    console.log("All labels are Superior/Calidad Superior, using Superior as combined label");
    const superiorLabel = availableLabels?.find((label) => 
      label.name === "Calidad Superior" || label.name === "Superior"
    )?.id || null;
    return superiorLabel;
  }
  
  console.log("Mixed labels or no clear priority, defaulting to Retenido");
  return availableLabels?.find((label) => label.name === "Retenido")?.id || null;
};

export const getLabelName = (
  labelId: string | null | undefined,
  availableLabels: SampleLabel[] | null | undefined,
): string => {
  if (!labelId || !availableLabels) return "Retenido";
  const label = availableLabels.find((l) => l.id === labelId);
  return label?.name || "Retenido";
};

export const getLotAggregatedLabel = async (lotId: string): Promise<string | null> => {
  try {
    // FIXED: Get samples with their label_id (not the removed label text column)
    const { data: samples, error: samplesError } = await supabase
      .from("samples")
      .select("id, label_id, test_ids")
      .eq("lot_id", lotId);
    
    if (samplesError) {
      console.error("Error fetching samples for lot", samplesError);
      return "Retenido";
    }
    
    // If no samples exist, default to Retenido
    if (!samples || samples.length === 0) {
      console.log("No samples found for lot, defaulting to Retenido");
      return "Retenido";
    }
    
    const { data: labels, error: labelsError } = await supabase
      .from("sample_labels")
      .select("id, name");
    
    if (labelsError) {
      console.error("Error fetching labels", labelsError);
      return "Retenido";
    }
    
    const labelMap: Record<string, string> = {};
    labels.forEach(label => {
      labelMap[label.id] = label.name;
    });
    
    const { data: parameters, error: paramsError } = await supabase
      .from("parameters")
      .select("id, name");
    
    if (paramsError) {
      console.error("Error fetching parameters", paramsError);
      return "Retenido";
    }
    
    const expectedParams = parameters.map(p => p.id);
    const testedParams = new Set<string>();
    
    for (const sample of samples) {
      if (sample.test_ids && sample.test_ids.length > 0) {
        const { data: testParams, error: testParamsError } = await supabase
          .from("test_results")
          .select("parameter_id")
          .eq("sample_id", sample.id);
        
        if (testParamsError) {
          console.error("Error fetching test parameters", testParamsError);
          return "Retenido";
        }
        
        testParams.forEach(tp => testedParams.add(tp.parameter_id));
      }
    }
    
    // If no test results exist for any parameters, default to Retenido
    if (testedParams.size === 0) {
      console.log("No test results found for any parameters, defaulting to Retenido");
      return "Retenido";
    }
    
    // If some expected parameters are missing results, default to Retenido
    if (expectedParams.some(p => !testedParams.has(p))) {
      console.log("Missing test results for some parameters, defaulting to Retenido");
      return "Retenido";
    }
    
    // FIXED: Get label names from sample label_id (not the removed label text column)
    const labelNames = samples
      .map(sample => sample.label_id ? labelMap[sample.label_id] : null)
      .filter(Boolean) as string[];
    
    // If no labeled samples exist, default to Retenido
    if (!labelNames.length) {
      console.log("No labeled samples, defaulting to Retenido");
      return "Retenido";
    }
    
    // FIXED: Apply proper "most demanding criteria" rule
    if (labelNames.includes("Retenido")) {
      return "Retenido";
    } else if (labelNames.includes("Calidad Standard") || labelNames.includes("Standard")) {
      return "Standard";
    } else if (labelNames.every(name => name === "Calidad Superior" || name === "Superior")) {
      return "Superior";
    } else {
      return "Retenido"; // Default for mixed/unknown results
    }
  } catch (error) {
    console.error("Error in getLotAggregatedLabel:", error);
    return "Retenido";
  }
};
