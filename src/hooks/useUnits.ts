
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Unit } from '@/types/master-data';

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: async (): Promise<Unit[]> => {
      console.log('Fetching units...');
      
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching units:', error);
        throw error;
      }

      console.log('Fetched units:', data);
      
      return (data || []).map(unit => ({
        id: unit.id,
        name: unit.name,
      }));
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
