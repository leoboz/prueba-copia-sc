
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { TestResult } from '@/types';
import { toast } from '@/hooks/use-toast';
import { fetchSingleSampleResults } from './test-results/fetchTestResults';
import { saveTestResultsToDatabase } from './test-results/saveTestResults';
import { v4 as uuidv4 } from 'uuid';

/**
 * Enhanced hook for managing test results with better error handling and logging
 */
export const useTestResultsEnhanced = () => {
  const queryClient = useQueryClient();

  // Enhanced query for single sample results with better error handling
  const useSingleSampleResults = (sampleId: string | null) => {
    return useQuery({
      queryKey: ['testResults', sampleId],
      queryFn: async () => {
        console.log(`🔍 Enhanced: Fetching test results for sample ${sampleId}`);
        
        if (!sampleId) {
          console.error('❌ Enhanced: No sample ID provided');
          throw new Error('Sample ID is required');
        }
        
        try {
          const results = await fetchSingleSampleResults(sampleId);
          console.log(`✅ Enhanced: Successfully fetched ${results.length} test results for sample ${sampleId}`);
          return results;
        } catch (error) {
          console.error(`💥 Enhanced: Error fetching test results for sample ${sampleId}:`, error);
          throw error;
        }
      },
      enabled: !!sampleId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  };

  // Enhanced mutation for saving test results
  const saveTestResults = useMutation({
    mutationFn: async ({ 
      results, 
      sampleId 
    }: { 
      results: Omit<TestResult, 'id' | 'createdAt' | 'updatedAt'>[]; 
      sampleId: string 
    }) => {
      console.log(`💾 Enhanced: Saving ${results.length} test results for sample ${sampleId}`);
      
      if (!results || results.length === 0) {
        const error = new Error("No results provided");
        console.error('❌ Enhanced: Save failed - no results provided');
        throw error;
      }
      
      if (!sampleId) {
        const error = new Error("Sample ID is required");
        console.error('❌ Enhanced: Save failed - no sample ID provided');
        throw error;
      }
      
      // Map the results to ensure they match what the database expects
      const formattedResults = results.map(result => {
        const resultWithId = {
          ...result,
          id: uuidv4(), // Generate a new UUID for each result
          value: String(result.value) // Ensure value is always a string
        };
        
        console.log(`🔧 Enhanced: Formatted result for parameter ${result.parameterId}:`, resultWithId);
        return resultWithId;
      });
      
      console.log(`📤 Enhanced: Formatted ${formattedResults.length} results for database save`);
      
      try {
        const response = await saveTestResultsToDatabase({ 
          testResults: formattedResults as Partial<TestResult>[], 
          sampleId 
        });
        
        console.log(`✅ Enhanced: Successfully saved test results for sample ${sampleId}`);
        return response;
      } catch (error) {
        console.error(`💥 Enhanced: Failed to save test results for sample ${sampleId}:`, error);
        throw error;
      }
    },
    onSuccess: (_, { sampleId }) => {
      console.log(`🔄 Enhanced: Invalidating queries after successful save for sample ${sampleId}`);
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      queryClient.invalidateQueries({ queryKey: ['testResults', sampleId] });
      queryClient.invalidateQueries({ queryKey: ['testResults'] });
      
      // Clear session storage cache
      sessionStorage.removeItem(`testResults-${sampleId}`);
      
      toast({
        title: "Éxito",
        description: "Resultados guardados y etiqueta asignada correctamente.",
      });
    },
    onError: (error, { sampleId }) => {
      console.error(`💥 Enhanced: Save mutation failed for sample ${sampleId}:`, error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados. Por favor intente nuevamente.",
        variant: "destructive",
      });
    }
  });

  // Enhanced function to get test results with better error handling
  const getSampleResults = async (sampleId: string): Promise<TestResult[]> => {
    console.log(`🔍 Enhanced: getSampleResults called for sample ${sampleId}`);
    
    if (!sampleId) {
      console.error('❌ Enhanced: getSampleResults called without sample ID');
      throw new Error('Sample ID is required');
    }
    
    try {
      const results = await fetchSingleSampleResults(sampleId);
      console.log(`✅ Enhanced: getSampleResults returned ${results.length} results for sample ${sampleId}`);
      return results;
    } catch (error) {
      console.error(`💥 Enhanced: getSampleResults failed for sample ${sampleId}:`, error);
      throw error;
    }
  };

  return {
    getSampleResults,
    useSingleSampleResults,
    saveTestResults
  };
};
