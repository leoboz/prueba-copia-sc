
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for fetching sample types
 */
export const useSampleTypes = () => {
  const { data: sampleTypes } = useQuery({
    queryKey: ['sampleTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sample_types')
        .select('id, name, description');
      
      if (error) {
        console.error('Sample types fetch error:', error.message, error);
        throw error;
      }
      
      return data;
    },
  });

  return { sampleTypes };
};
