import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSampleLabels = () => {
  const { data: labels, isLoading } = useQuery({
    queryKey: ['sample_labels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sample_labels')
        .select('id, name, description');
      if (error) {
        console.error('Sample labels fetch error:', error.message, error);
        throw error;
      }
      return data;
    },
  });

  return { labels, isLoading };
};
