
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Parameter {
  id: string;
  name: string;
  type: string;
  description?: string;
  testId: string;
  testName: string;
  existingStandards?: {
    [labelName: string]: {
      standardId: string;
      min: number;
      max: number;
    };
  };
}

export const useParametersForStandards = () => {
  return useQuery({
    queryKey: ['parameters-for-standards'],
    queryFn: async (): Promise<Parameter[]> => {
      console.log('Fetching parameters and existing standards...');
      
      // First, get all tests
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select(`
          id,
          name,
          is_template
        `);

      if (testsError) {
        console.error('Error fetching tests:', testsError);
        throw testsError;
      }

      console.log('Fetched tests:', tests);

      if (!tests || tests.length === 0) {
        console.log('No tests found');
        return [];
      }

      // Get all parameters for these tests
      const testIds = tests.map(test => test.id);
      const { data: parameters, error: parametersError } = await supabase
        .from('parameters')
        .select(`
          id,
          name,
          type,
          description,
          test_id
        `)
        .in('test_id', testIds);

      if (parametersError) {
        console.error('Error fetching parameters:', parametersError);
        throw parametersError;
      }

      console.log('Fetched parameters:', parameters);

      if (!parameters || parameters.length === 0) {
        console.log('No parameters found');
        return [];
      }

      // Get existing standards for all parameters with proper label joins
      const allParameterIds = parameters.map(p => p.id);
      const { data: standards, error: standardsError } = await supabase
        .from('standards')
        .select(`
          id,
          parameter_id,
          criteria,
          sample_labels!inner(
            id,
            name
          )
        `)
        .in('parameter_id', allParameterIds);

      if (standardsError) {
        console.error('Error fetching standards:', standardsError);
        throw standardsError;
      }

      console.log('Fetched standards with labels:', standards);

      // Transform the data
      const result: Parameter[] = [];
      
      parameters.forEach(param => {
        const test = tests.find(t => t.id === param.test_id);
        if (!test) return;

        const paramStandards = standards?.filter(s => s.parameter_id === param.id) || [];
        const existingStandards: { [key: string]: { standardId: string; min: number; max: number } } = {};
        
        paramStandards.forEach(standard => {
          if (standard.sample_labels?.name && standard.criteria) {
            const criteria = standard.criteria as { min: number; max: number };
            const labelName = standard.sample_labels.name.toLowerCase();
            
            console.log(`Processing standard for parameter ${param.name}, label: ${standard.sample_labels.name}, criteria:`, criteria);
            
            existingStandards[labelName] = {
              standardId: standard.id,
              min: criteria.min,
              max: criteria.max
            };
          }
        });

        console.log(`Parameter ${param.name} existing standards:`, existingStandards);

        result.push({
          id: param.id,
          name: param.name,
          type: param.type || 'text',
          description: param.description,
          testId: test.id,
          testName: test.name,
          existingStandards: Object.keys(existingStandards).length > 0 ? existingStandards : undefined
        });
      });

      console.log('Final processed parameters with standards:', result);
      return result;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
