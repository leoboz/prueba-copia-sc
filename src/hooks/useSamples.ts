
import { useFetchSamples } from './useFetchSamples';
import { useSampleDetails } from './useSampleDetails';
import { useSampleTypes } from './useSampleTypes';
import { useTestResults } from './useTestResults';
import { useUsers } from './useUsers';

/**
 * Main hook that combines all sample-related hooks for backward compatibility
 * This maintains the original API so existing components don't break
 */
export const useSamples = () => {
  const { samples, isLoading } = useFetchSamples();
  const { sampleTypes } = useSampleTypes();
  const { getSampleById, updateSampleStatus, createSample } = useSampleDetails();
  const { getSampleResults, saveTestResults } = useTestResults();
  const { multipliers } = useUsers();

  // Enhance samples with multiplier information if available
  const enhancedSamples = samples?.map(sample => {
    if (sample.lot && !sample.lot.user && multipliers) {
      // Check if we can get user ID from the sample's userId property or lot's user.id
      const lotUserId = sample.lot.user?.id || sample.userId;
      if (lotUserId) {
        const multiplier = multipliers.find(m => m.id === lotUserId);
        if (multiplier) {
          return {
            ...sample,
            lot: {
              ...sample.lot,
              user: multiplier
            }
          };
        }
      }
    }
    return sample;
  });

  return {
    samples: enhancedSamples || samples,
    isLoading,
    sampleTypes,
    getSampleById,
    updateSampleStatus,
    createSample,
    getSampleResults,
    saveTestResults
  };
};
