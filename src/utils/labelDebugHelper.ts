
import { supabase } from '@/integrations/supabase/client';

/**
 * Utility function to test the standards evaluation logic with specific values
 */
export const testStandardEvaluation = async (parameterId: string, value: number) => {
  try {
    // Fetch standards for the parameter
    const { data: standards, error } = await supabase
      .from('standards')
      .select(`
        id,
        parameter_id,
        label_id,
        criteria,
        sample_labels:sample_labels!standards_label_id_fkey(id, name)
      `)
      .eq('parameter_id', parameterId);
    
    if (error) {
      console.error('Error fetching standards:', error);
      return { success: false, error };
    }
    
    if (!standards || standards.length === 0) {
      return { success: false, message: 'No standards found for this parameter' };
    }
    
    // Test each standard against the value
    const results = standards.map(standard => {
      const criteriaObj = standard.criteria as Record<string, any>;
      
      if (!criteriaObj || typeof criteriaObj !== 'object') {
        return {
          standardId: standard.id,
          label: standard.sample_labels?.name,
          valid: false,
          reason: 'Invalid criteria format'
        };
      }
      
      const min = criteriaObj.min === undefined ? -Infinity : Number(criteriaObj.min);
      const max = criteriaObj.max === undefined ? Infinity : Number(criteriaObj.max);
      
      const meetsCriteria = value >= min && value <= max;
      
      return {
        standardId: standard.id,
        label: standard.sample_labels?.name,
        valid: meetsCriteria,
        min,
        max,
        value
      };
    });
    
    return {
      success: true,
      parameterId,
      value,
      results
    };
  } catch (error) {
    console.error('Error testing standard evaluation:', error);
    return { success: false, error };
  }
};

/**
 * Utility function to debug label assignment for a specific sample
 */
export const debugSampleLabels = async (sampleId: string) => {
  try {
    // Fetch test results for the sample
    const { data: testResults, error: testResultsError } = await supabase
      .from('test_results')
      .select(`
        id, 
        parameter_id, 
        value,
        parameter:parameters(id, name),
        test_result_labels(label_id, sample_labels:sample_labels(id, name))
      `)
      .eq('sample_id', sampleId);
    
    if (testResultsError) {
      console.error('Error fetching test results:', testResultsError);
      return { success: false, error: testResultsError };
    }
    
    // Fetch standards for these parameters
    const parameterIds = testResults.map(r => r.parameter_id);
    const { data: standards, error: standardsError } = await supabase
      .from('standards')
      .select(`
        parameter_id,
        criteria,
        sample_labels:sample_labels!standards_label_id_fkey(id, name)
      `)
      .in('parameter_id', parameterIds);
    
    if (standardsError) {
      console.error('Error fetching standards:', standardsError);
      return { success: false, error: standardsError };
    }
    
    // Debug each result against its standards
    const resultsWithEvaluation = testResults.map(result => {
      const parameterStandards = standards.filter(s => s.parameter_id === result.parameter_id);
      const value = parseFloat(result.value);
      
      const evaluations = parameterStandards.map(standard => {
        const criteriaObj = standard.criteria as Record<string, any>;
        
        if (!criteriaObj || typeof criteriaObj !== 'object') {
          return {
            label: standard.sample_labels?.name,
            valid: false,
            reason: 'Invalid criteria format'
          };
        }
        
        const min = criteriaObj.min === undefined ? -Infinity : Number(criteriaObj.min);
        const max = criteriaObj.max === undefined ? Infinity : Number(criteriaObj.max);
        
        const meetsCriteria = value >= min && value <= max;
        
        return {
          label: standard.sample_labels?.name,
          valid: meetsCriteria,
          criteria: { min, max },
          value
        };
      });
      
      return {
        id: result.id,
        parameter: result.parameter?.name,
        value: result.value,
        numericValue: value,
        assignedLabel: result.test_result_labels?.[0]?.sample_labels?.name,
        evaluations
      };
    });
    
    // Get sample's combined label
    const { data: sample, error: sampleError } = await supabase
      .from('samples')
      .select('id, label_id, sample_labels:sample_labels(name)')
      .eq('id', sampleId)
      .single();
    
    if (sampleError) {
      console.error('Error fetching sample:', sampleError);
    }
    
    return {
      success: true,
      sampleId,
      combinedLabel: sample?.sample_labels?.name,
      results: resultsWithEvaluation,
      raw: {
        testResults,
        standards
      }
    };
  } catch (error) {
    console.error('Error debugging sample labels:', error);
    return { success: false, error };
  }
};
