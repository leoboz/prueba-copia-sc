import { supabase } from '@/integrations/supabase/client';
import { TestResult } from '@/types';
import { toast } from '@/hooks/use-toast';
import { withQueryLogging } from '@/integrations/supabase/queryLogger';

/**
 * Internal function to fetch test results for multiple samples
 */
const _fetchSampleResults = async (sampleIds: string[]): Promise<TestResult[]> => {
  if (!sampleIds || sampleIds.length === 0) {
    return [];
  }

  // For single sample, check cache first
  if (sampleIds.length === 1) {
    const cacheKey = `testResults-${sampleIds[0]}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        const cacheTime = parsed.timestamp || 0;
        const now = Date.now();
        
        if (now - cacheTime < 30000) {
          console.log('Using cached test results for sample:', sampleIds[0]);
          return parsed.data;
        }
      } catch (e) {
        console.warn('Error parsing cached data:', e);
      }
    }
  }
  
  let retries = 2;
  let lastError = null;
  
  while (retries >= 0) {
    try {
      console.log(`Fetching results for samples: ${sampleIds.join(', ')} (attempts remaining: ${retries})`);
      
      const { data, error } = await (supabase
        .from('test_results')
        .select(`
          id,
          sample_id,
          test_id,
          parameter_id,
          value,
          is_valid,
          created_at,
          updated_at,
          parameter:parameters(id, name, type, validation),
          test_result_labels!test_result_id(label_id, sample_labels:sample_labels(name))
        `)
        .in('sample_id', sampleIds) as any);
      
      if (error) {
        console.error(`Test results fetch error (attempt ${2-retries}/3):`, error.message, error);
        lastError = error;
        retries--;
        if (retries >= 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
          continue;
        }
        throw error;
      }
      
      console.log(`Successfully fetched ${data.length} test results for samples ${sampleIds.join(', ')}:`, data);
      
      const transformedResults = data.map(item => {
        const labelName = item.test_result_labels && 
                         item.test_result_labels.length > 0 && 
                         item.test_result_labels[0].sample_labels ? 
                         item.test_result_labels[0].sample_labels.name : null;
        
        console.log(`Result ID ${item.id} has label:`, labelName);
        
        return {
          id: item.id,
          sampleId: item.sample_id,
          testId: item.test_id,
          parameterId: item.parameter_id,
          value: item.value,
          isValid: item.is_valid,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          parameter: item.parameter ? {
            id: item.parameter.id,
            name: item.parameter.name,
            type: item.parameter.type,
            testId: item.test_id,
            validation: item.parameter.validation,
            createdAt: item.created_at || '',
            updatedAt: item.updated_at || ''
          } : undefined,
          label: labelName
        };
      });
      
      // Cache results for single sample queries
      if (sampleIds.length === 1) {
        const cacheKey = `testResults-${sampleIds[0]}`;
        const sampleResults = transformedResults.filter(r => r.sampleId === sampleIds[0]);
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: sampleResults,
          timestamp: Date.now()
        }));
      }
      
      return transformedResults as TestResult[];
    } catch (error) {
      console.error(`Error in fetchSampleResults (attempt ${2-retries}/3):`, error);
      lastError = error;
      retries--;
      if (retries >= 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      }
    }
  }
  
  console.error('Failed to fetch test results after multiple attempts:', lastError);
  toast({
    title: "Error al cargar resultados",
    description: "No se pudieron cargar los resultados de prueba. Por favor intente nuevamente.",
    variant: "destructive",
  });
  return [] as TestResult[];
};

/**
 * Internal function for single sample
 */
const _fetchSingleSampleResults = async (sampleId: string): Promise<TestResult[]> => {
  return _fetchSampleResults([sampleId]);
};

/**
 * Fetches test results for multiple samples with caching and retry logic
 */
export const fetchSampleResults = withQueryLogging(
  'fetchSampleResults',
  _fetchSampleResults
);

/**
 * Fetches test results for a single sample - kept for backwards compatibility
 */
export const fetchSingleSampleResults = withQueryLogging(
  'fetchSingleSampleResults',
  _fetchSingleSampleResults
);
