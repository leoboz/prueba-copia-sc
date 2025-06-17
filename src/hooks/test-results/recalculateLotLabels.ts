import { supabase } from "@/integrations/supabase/client";

/**
 * One-time function to recalculate all lot labels based on current test results
 * This fixes any lots that have incorrect calculated_label_id values
 */
export const recalculateAllLotLabels = async () => {
  console.log("🔄 Starting recalculation of all lot labels...");

  // Get all lots
  const { data: lots, error: lotsError } = await supabase
    .from("lots")
    .select("id, code");

  if (lotsError) {
    console.error("Error fetching lots:", lotsError);
    throw lotsError;
  }

  console.log(`📋 Found ${lots.length} lots to recalculate`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const lot of lots) {
    try {
      console.log(`🔄 Recalculating lot ${lot.code} (${lot.id})`);
      await calculateLotLabel(lot.id);
      updatedCount++;
    } catch (error) {
      console.error(`💥 Error recalculating lot ${lot.code}:`, error);
      errorCount++;
    }
  }

  console.log(`✅ Recalculation complete: ${updatedCount} updated, ${errorCount} errors`);
  return { updatedCount, errorCount };
};

/**
 * Calculate lot label based on test result labels with proper "highest bar" logic
 */
async function calculateLotLabel(lotId: string) {
  console.log(`🏷️  [RECALC] Starting lot label calculation for lot ${lotId}`);

  // Get all samples for this lot
  const { data: lotSamples, error: lotSamplesError } = await supabase
    .from("samples")
    .select("id")
    .eq("lot_id", lotId);

  if (lotSamplesError) {
    console.error("[RECALC] Error fetching lot samples:", lotSamplesError);
    throw lotSamplesError;
  }

  console.log(`📊 [RECALC] Found ${lotSamples.length} samples for lot ${lotId}`);

  if (lotSamples.length === 0) {
    console.log("⚠️  [RECALC] No samples found for the lot");
    return;
  }

  // Get all test results with their labels for all samples in the lot
  const sampleIds = lotSamples.map(s => s.id);
  
  const { data: allTestResults, error: testResultsError } = await supabase
    .from("test_results")
    .select(`
      id,
      sample_id,
      parameter_id,
      created_at,
      test_result_labels(
        label_id,
        label:sample_labels(name)
      )
    `)
    .in("sample_id", sampleIds)
    .order("created_at", { ascending: false });

  if (testResultsError) {
    console.error("[RECALC] Error fetching test results:", testResultsError);
    throw testResultsError;
  }

  console.log(`📈 [RECALC] Found ${allTestResults.length} test results for lot calculation`);

  // Get the latest test result per parameter across all samples
  const latestByParameter = new Map<string, any>();
  
  allTestResults.forEach(result => {
    if (result.test_result_labels?.length > 0) {
      const parameterId = result.parameter_id;
      const existing = latestByParameter.get(parameterId);
      
      // Only keep the latest result for each parameter
      if (!existing || new Date(result.created_at) > new Date(existing.created_at)) {
        latestByParameter.set(parameterId, result);
      }
    }
  });

  console.log(`🎯 [RECALC] Latest results by parameter: ${latestByParameter.size} parameters`);

  // Extract label names from the latest test results
  const testResultLabelNames = Array.from(latestByParameter.values())
    .map(result => result.test_result_labels[0]?.label?.name)
    .filter(Boolean);

  console.log(`🏷️  [RECALC] Test result labels for lot calculation:`, testResultLabelNames);

  // Get lot labels to find the corresponding lot label IDs
  const { data: lotLabels, error: lotLabelsError } = await supabase
    .from("lot_labels")
    .select("id, name");

  if (lotLabelsError) {
    console.error("[RECALC] Error fetching lot labels:", lotLabelsError);
    throw lotLabelsError;
  }

  let calculatedLabelId: string | null = null;
  
  // Apply the "most demanding criteria" rule with explicit logic
  console.log(`🔍 [RECALC] Applying highest bar logic to labels:`, testResultLabelNames);
  
  if (testResultLabelNames.length === 0) {
    console.log("⚪ [RECALC] No test result labels found → No analizado");
    calculatedLabelId = lotLabels.find(l => l.name === "No analizado")?.id || null;
  } else if (testResultLabelNames.includes("Retenido")) {
    console.log("🔴 [RECALC] Found Retenido → Lot = Retenido");
    calculatedLabelId = lotLabels.find(l => l.name === "Retenido")?.id || null;
  } else if (testResultLabelNames.some(label => label === "Calidad Standard" || label === "Standard")) {
    console.log("🟡 [RECALC] Found Standard/Calidad Standard → Lot = Standard");
    calculatedLabelId = lotLabels.find(l => l.name === "Standard")?.id || null;
  } else if (testResultLabelNames.every(label => label === "Calidad Superior" || label === "Superior")) {
    console.log("🟢 [RECALC] All test results are Superior/Calidad Superior → Lot = Superior");
    calculatedLabelId = lotLabels.find(l => l.name === "Superior")?.id || null;
  } else {
    console.log("⚪ [RECALC] Mixed or unrecognized labels → No analizado");
    calculatedLabelId = lotLabels.find(l => l.name === "No analizado")?.id || null;
  }

  console.log(`🎯 [RECALC] Final calculated lot label ID: ${calculatedLabelId}`);

  // Update lot's calculated label
  const { error: lotUpdateError } = await supabase
    .from("lots")
    .update({
      calculated_label_id: calculatedLabelId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lotId);

  if (lotUpdateError) {
    console.error("[RECALC] Error updating lot calculated label:", lotUpdateError);
    throw lotUpdateError;
  }
  
  console.log(`✅ [RECALC] Updated lot ${lotId} calculated_label_id to ${calculatedLabelId}`);
}
