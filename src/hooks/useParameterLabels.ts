import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ParameterLabelData {
  parameter: string;
  label: string;
}

export const useParameterLabels = (sampleIds: string[]) => {
  return useQuery({
    queryKey: ['parameter-labels', sampleIds],
    queryFn: async (): Promise<ParameterLabelData[]> => {
      if (!sampleIds || sampleIds.length === 0) {
        return [];
      }

      console.log('🔍 Fetching parameter labels for samples:', sampleIds);

      // FIXED: Get the latest test result per parameter with proper label information
      const { data: testResults, error } = await supabase
        .from('test_results')
        .select(`
          parameter_id,
          created_at,
          parameter:parameters(name),
          test_result_labels(
            label:sample_labels(name)
          )
        `)
        .in('sample_id', sampleIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching parameter labels:', error);
        throw error;
      }

      console.log('📊 Raw test results with labels:', testResults);

      // FIXED: Get only the latest test result per parameter
      const latestByParameter = new Map<string, any>();
      
      testResults?.forEach(result => {
        if (result.parameter?.name && result.test_result_labels?.length > 0) {
          const parameterName = result.parameter.name;
          const existing = latestByParameter.get(parameterName);
          
          // Only keep the latest result for each parameter
          if (!existing || new Date(result.created_at) > new Date(existing.created_at)) {
            latestByParameter.set(parameterName, result);
          }
        }
      });

      // Transform to the expected format using only latest results
      const parameterLabels: ParameterLabelData[] = [];
      
      latestByParameter.forEach(result => {
        const label = result.test_result_labels[0]?.label?.name;
        if (label) {
          parameterLabels.push({
            parameter: result.parameter.name,
            label: label
          });
        }
      });

      console.log('🏷️ Latest parameter labels (one per parameter):', parameterLabels);
      return parameterLabels;
    },
    enabled: sampleIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
