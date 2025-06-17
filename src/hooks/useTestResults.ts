
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { TestResult } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useSampleLabels } from './useSampleLabels';
import { fetchSampleResults, fetchSingleSampleResults } from './test-results/fetchTestResults';
import { saveTestResultsToDatabase, SaveTestResultsParams } from './test-results/saveTestResults';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for managing test results for samples with React Query caching
 */
export const useTestResults = () => {
  const queryClient = useQueryClient();
  const { labels } = useSampleLabels();

  // React Query hook for fetching test results for multiple samples
  const useSampleResults = (sampleIds: string[] | null) => {
    return useQuery({
      queryKey: ['testResults', sampleIds],
      queryFn: () => fetchSampleResults(sampleIds || []),
      enabled: !!sampleIds && sampleIds.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
  };

  // React Query hook for fetching test results for a single sample
  const useSingleSampleResults = (sampleId: string | null) => {
    return useQuery({
      queryKey: ['testResults', sampleId],
      queryFn: () => fetchSingleSampleResults(sampleId || ''),
      enabled: !!sampleId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
  };

  // Function to get test results for specific samples (legacy support)
  const getSampleResults = fetchSingleSampleResults;

  // Mutation for saving test results
  const saveTestResults = useMutation({
    mutationFn: saveTestResultsToDatabase,
    onSuccess: (_, { sampleId }) => {
      console.log('Test results saved successfully');
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      queryClient.invalidateQueries({ queryKey: ['testResults', sampleId] });
      queryClient.invalidateQueries({ queryKey: ['testResults'] });
      sessionStorage.removeItem(`testResults-${sampleId}`);
      toast({
        title: "Éxito",
        description: "Resultados guardados y etiqueta asignada correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error saving test results:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados. Por favor intente nuevamente.",
        variant: "destructive",
      });
    }
  });

  // Create a wrapper function to adapt the interface
  const wrappedSaveTestResults = {
    mutateAsync: ({ results, sampleId }: { results: Omit<TestResult, 'id' | 'createdAt' | 'updatedAt'>[]; sampleId: string }) => {
      console.log('Saving results:', results);
      
      if (!results || results.length === 0) {
        return Promise.reject(new Error("No results provided"));
      }
      
      // Map the results to ensure they match what the database expects
      const formattedResults = results.map(result => {
        // Since 'id' is omitted from our input type, we need to add it here
        const resultWithId = {
          ...result,
          id: uuidv4(), // Generate a new UUID for each result
          value: String(result.value) // Ensure value is always a string
        };
        
        return resultWithId;
      });
      
      console.log('Formatted results with IDs:', formattedResults);
      
      // Type-cast the results to match what saveTestResultsToDatabase expects
      return saveTestResults.mutateAsync({ 
        testResults: formattedResults as Partial<TestResult>[], 
        sampleId 
      });
    }
  };

  return {
    getSampleResults,
    useSampleResults, // New hook for multiple samples
    useSingleSampleResults, // New hook for single sample
    saveTestResults: wrappedSaveTestResults
  };
};
