import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsers = () => {
  const { data: multipliers, isLoading: isLoadingMultipliers } = useQuery({
    queryKey: ['multipliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'multiplier');

      if (error) {
        console.error('Multipliers fetch error:', error.message, error);
        throw error;
      }

      return data as { id: string; name: string; email: string }[];
    },
  });

  const { data: labs, isLoading: isLoadingLabs } = useQuery({
    queryKey: ['labs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'lab');

      if (error) {
        console.error('Labs fetch error:', error.message, error);
        throw error;
      }

      console.log('Fetched labs:', data);
      return data as { id: string; name: string; email: string }[];
    },
  });

  return {
    multipliers,
    isLoadingMultipliers,
    labs,
    isLoadingLabs,
  };
};