import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSampleStatuses = () => {
  const { data: statuses, isLoading } = useQuery({
    queryKey: ['sample_statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sample_statuses')
        .select('id, name, description');
      if (error) {
        console.error('Sample statuses fetch error:', error.message, error);
        throw error;
      }
      return data;
    },
  });

  return { statuses, isLoading };
};
