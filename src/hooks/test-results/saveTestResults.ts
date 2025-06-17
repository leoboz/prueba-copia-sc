
import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "@/types";
import { determineCombinedLabel } from "./sampleLabelUtils";
import { v4 as uuidv4 } from "uuid";

export interface SaveTestResultsParams {
  sampleId: string;
  testResults: Partial<TestResult>[];
  override?: boolean;
}

/**
 * Saves test results to the database and assigns labels based on standards
 */
export const saveTestResultsToDatabase = async ({
  sampleId,
  testResults,
  override = false,
}: SaveTestResultsParams) => {
  if (!testResults || testResults.length === 0) {
    console.error("No results provided to save");
    throw new Error("No results provided to save");
  }

  console.log(`Saving ${testResults.length} test results for sample ${sampleId}`);

  // Fetch all available sample labels
  const { data: availableLabels, error: labelsError } = await supabase
    .from("sample_labels")
    .select("id, name, description");

  if (labelsError) {
    console.error("Failed to fetch sample labels:", labelsError);
    throw new Error("Failed to fetch sample labels");
  }

  if (!availableLabels || availableLabels.length === 0) {
    console.error("No sample labels found in database");
    throw new Error("No sample labels found in database");
  }

  console.log("Available sample labels:", availableLabels);

  // Fetch standards for relevant tests and parameters
  const testIds = [...new Set(testResults.map((r) => r.testId).filter(Boolean))] as string[];
  const parameterIds = [...new Set(testResults.map((r) => r.parameterId).filter(Boolean))] as string[];
  console.log("Test IDs:", testIds, "Parameter IDs:", parameterIds);
  
  const { data: standards, error: standardsError } = await supabase
    .from("standards")
    .select("test_id, parameter_id, label_id, criteria")
    .in("test_id", testIds)
    .in("parameter_id", parameterIds);

  if (standardsError) {
    console.error("Failed to fetch standards:", standardsError);
    throw new Error("Failed to fetch standards");
  }
  console.log("Fetched standards:", standards);

  // Prepare test result data with evaluated labels
  const resultsToSave = testResults.map((result) => {
    if (!result.testId || !result.parameterId) {
      console.error(`Missing testId or parameterId for result:`, result);
      const retenidoLabel = availableLabels.find((l) => l.name === "Retenido");
      return {
        id: result.id || uuidv4(),
        sample_id: sampleId,
        test_id: result.testId,
        parameter_id: result.parameterId,
        value: String(result.value),
        is_valid: false,
        label: retenidoLabel?.name || null,
      };
    }

    const resultLabels: string[] = [];
    const relevantStandards = standards?.filter(
      (s) => s.test_id === result.testId && s.parameter_id === result.parameterId,
    ) || [];
    
    console.log(
      `Result testId: ${result.testId}, parameterId: ${result.parameterId}, relevant standards:`,
      relevantStandards,
    );

    let isValid = true;
    const value = String(result.value).trim();
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      isValid = false;
      console.log(`Invalid value for result: ${value}, marking as invalid`);
    } else {
      for (const standard of relevantStandards) {
        const criteria = standard.criteria as { min: number; max: number };
        const meetsCriteria = numericValue >= criteria.min && numericValue <= criteria.max;
        console.log(
          `Evaluating: value=${numericValue}, criteria=${JSON.stringify(criteria)}, meetsCriteria=${meetsCriteria}`,
        );

        if (meetsCriteria) {
          const label = availableLabels.find((l) => l.id === standard.label_id);
          if (label) {
            resultLabels.push(label.name);
            console.log(`Assigned label: ${label.name}`);
          } else {
            console.warn(`No label found for label_id: ${standard.label_id}`);
          }
        }
      }
    }

    // If no labels or invalid value, default to Retenido
    if (!isValid || resultLabels.length === 0) {
      const retenidoLabel = availableLabels.find((l) => l.name === "Retenido");
      if (retenidoLabel) {
        resultLabels.push(retenidoLabel.name);
        console.log("Defaulting to Retenido");
      }
      isValid = false;
    }

    // FIXED: Prioritize labels using actual database label names
    // Check for exact database label names first
    const prioritizedLabel = resultLabels.includes("Retenido")
      ? "Retenido"
      : resultLabels.includes("Calidad Standard") 
      ? "Calidad Standard"
      : resultLabels.includes("Calidad Superior")
      ? "Calidad Superior"
      : resultLabels.includes("Standard")  // Fallback for legacy names
      ? "Standard"
      : resultLabels.includes("Superior")  // Fallback for legacy names
      ? "Superior"
      : resultLabels[0] || "Retenido"; // Use first available or default to Retenido
    
    console.log(`Prioritized label for result: ${prioritizedLabel}, all labels:`, resultLabels);

    return {
      id: result.id || uuidv4(),
      sample_id: sampleId,
      test_id: result.testId,
      parameter_id: result.parameterId,
      value: String(result.value),
      is_valid: isValid,
      label: prioritizedLabel,
    };
  });

  console.log("Results to save:", JSON.stringify(resultsToSave));

  // Save the test results
  let savedResults;
  if (override) {
    const promises = resultsToSave.map(async (result) => {
      if (!result.id) return null;

      const { data, error } = await supabase
        .from("test_results")
        .update({
          value: result.value,
          is_valid: result.is_valid,
        })
        .eq("id", result.id)
        .select();

      if (error) {
        console.error("Error updating test result:", error);
        throw error;
      }

      return data[0];
    });

    savedResults = (await Promise.all(promises)).filter(Boolean);
  } else {
    try {
      const results = [];

      for (const result of resultsToSave) {
        console.log("Inserting result with ID:", result.id);

        const { data, error } = await supabase
          .from("test_results")
          .insert([
            {
              id: result.id,
              sample_id: result.sample_id,
              test_id: result.test_id,
              parameter_id: result.parameter_id,
              value: result.value,
              is_valid: result.is_valid,
            },
          ])
          .select("*, parameter:parameters(name)");

        if (error) {
          console.error("Error inserting test result:", error, "Result:", result);
          throw error;
        }

        if (data && data.length > 0) {
          results.push(...data);
          console.log("Result successfully inserted:", data[0].id);
        }
      }

      savedResults = results;
    } catch (error) {
      console.error("Error inserting test results:", error);
      throw error;
    }
  }

  // FIXED: Save labels for each test result with proper error handling
  const labelPromises = resultsToSave.map(async (result) => {
    if (!result.label || !result.id) {
      console.log(`Skipping label insertion for result ${result.id}: no label`);
      return null;
    }

    const labelObj = availableLabels?.find((l) => l.name === result.label);
    if (!labelObj) {
      console.error(`No label object found for label: ${result.label}`);
      return null;
    }

    try {
      // Clear existing labels for this test result
      await supabase.from("test_result_labels").delete().eq("test_result_id", result.id);

      // Add new label
      const { data, error } = await supabase.from("test_result_labels").insert({
        test_result_id: result.id,
        label_id: labelObj.id,
      }).select();

      if (error) {
        console.error("Error saving test result label:", error);
        return null;
      }

      console.log(`✅ Inserted label for result ${result.id}: ${labelObj.name}`);
      return {
        test_result_id: result.id,
        label_id: labelObj.id,
      };
    } catch (error) {
      console.error(`Error processing label for result ${result.id}:`, error);
      return null;
    }
  });

  const savedLabels = (await Promise.all(labelPromises)).filter(Boolean);
  console.log("Saved labels:", savedLabels);

  // Get all test result labels for this sample
  const { data: testResultLabels, error: testResultLabelsError } = await supabase
    .from("test_result_labels")
    .select("test_result_id, label_id")
    .in("test_result_id", resultsToSave.map((r) => r.id).filter(Boolean) as string[]);

  if (testResultLabelsError) {
    console.error("Error fetching test result labels:", testResultLabelsError);
    throw testResultLabelsError;
  }
  console.log("Test result labels:", testResultLabels);

  // Calculate combined label
  const combinedLabelId = determineCombinedLabel(testResultLabels || [], availableLabels);
  console.log("Combined label ID:", combinedLabelId);

  if (combinedLabelId) {
    // Update sample with combined label
    const { error: sampleUpdateError } = await supabase
      .from("samples")
      .update({ label_id: combinedLabelId })
      .eq("id", sampleId);

    if (sampleUpdateError) {
      console.error("Error updating sample label:", sampleUpdateError);
      throw sampleUpdateError;
    }

    // Get the sample's lot_id to update lot's calculated label
    const { data: sample, error: sampleError } = await supabase
      .from("samples")
      .select("lot_id")
      .eq("id", sampleId)
      .single();

    if (sample && !sampleError) {
      // FIXED: Implement proper lot label calculation with "latest sample per parameter" and "most demanding criteria"
      await calculateAndUpdateLotLabel(sample.lot_id, availableLabels);
    }
  }

  // Log action
  const { error: logError } = await supabase.from("action_logs").insert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    action: "save_test_results",
    details: {
      sampleId,
      testResultsCount: testResults.length,
      combinedLabelId,
    },
  });

  if (logError) {
    console.error("Error logging action:", logError);
  }

  return {
    results: savedResults,
    labels: savedLabels,
    combinedLabelId,
  };
};

/**
 * FIXED: Proper lot label calculation implementing business rules:
 * 1. Within same parameter: get latest sample label
 * 2. Across different parameters: apply "most demanding criteria" (Retenido > Standard > Superior)
 */
async function calculateAndUpdateLotLabel(lotId: string, availableLabels: any[]) {
  console.log(`🏷️ Calculating lot label for lot ${lotId}`);

  // Get all samples for the lot with their labels and test results
  const { data: lotSamples, error: lotSamplesError } = await supabase
    .from("samples")
    .select(`
      id, 
      label_id, 
      created_at,
      test_results(
        parameter_id,
        created_at,
        test_result_labels(
          label_id
        )
      )
    `)
    .eq("lot_id", lotId)
    .order("created_at", { ascending: false });

  if (lotSamplesError) {
    console.error("Error fetching lot samples:", lotSamplesError);
    throw lotSamplesError;
  }

  console.log(`Found ${lotSamples.length} samples for lot ${lotId}:`, lotSamples);

  if (!lotSamples || lotSamples.length === 0) {
    console.log("No samples found for lot, keeping current calculated label");
    return;
  }

  // Step 1: Get latest sample label per parameter
  const latestSampleLabelsByParameter: Record<string, string> = {};
  
  for (const sample of lotSamples) {
    if (!sample.test_results) continue;
    
    for (const testResult of sample.test_results) {
      const parameterId = testResult.parameter_id;
      if (!parameterId) continue;
      
      // If we haven't seen this parameter yet, or this sample is newer, use its label
      if (!latestSampleLabelsByParameter[parameterId]) {
        if (sample.label_id) {
          const labelName = availableLabels.find(l => l.id === sample.label_id)?.name;
          if (labelName) {
            latestSampleLabelsByParameter[parameterId] = labelName;
            console.log(`📋 Parameter ${parameterId}: Latest sample label = ${labelName}`);
          }
        }
      }
    }
  }

  const parameterLabels = Object.values(latestSampleLabelsByParameter);
  console.log("Latest sample labels by parameter:", parameterLabels);

  if (parameterLabels.length === 0) {
    console.log("No parameter labels found, keeping current calculated label");
    return;
  }

  // Step 2: Apply "most demanding criteria" across different parameters
  const { data: lotLabels, error: lotLabelsError } = await supabase
    .from("lot_labels")
    .select("id, name");

  if (lotLabelsError) {
    console.error("Error fetching lot labels:", lotLabelsError);
    throw lotLabelsError;
  }

  let calculatedLabelId: string | null = null;
  
  // FIXED: Apply the "most demanding criteria" rule using exact database label names
  if (parameterLabels.includes("Retenido")) {
    calculatedLabelId = lotLabels.find(l => l.name === "Retenido")?.id || null;
    console.log("🚫 Found Retenido → Lot label = Retenido");
  } else if (parameterLabels.some(label => label.includes("Standard") || label === "Calidad Standard")) {
    calculatedLabelId = lotLabels.find(l => l.name === "Standard")?.id || null;
    console.log("📊 Found Standard/Calidad Standard → Lot label = Standard");
  } else if (parameterLabels.every(label => label.includes("Superior") || label === "Calidad Superior")) {
    calculatedLabelId = lotLabels.find(l => l.name === "Superior")?.id || null;
    console.log("⭐ All Superior/Calidad Superior → Lot label = Superior");
  } else {
    // Default to Standard for mixed results
    calculatedLabelId = lotLabels.find(l => l.name === "Standard")?.id || null;
    console.log("🔄 Mixed results → Default to Standard");
  }

  console.log(`🎯 Final calculated lot label ID: ${calculatedLabelId}`);

  // Update lot's calculated label
  const { error: lotUpdateError } = await supabase
    .from("lots")
    .update({
      calculated_label_id: calculatedLabelId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lotId);

  if (lotUpdateError) {
    console.error("Error updating lot calculated label:", lotUpdateError);
    throw lotUpdateError;
  }
  
  console.log(`✅ Updated lot ${lotId} calculated_label_id to ${calculatedLabelId}`);
}
