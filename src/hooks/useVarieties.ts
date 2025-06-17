
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVarieties = () => {
  return useQuery({
    queryKey: ['varieties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('varieties')
        .select(`
          id,
          name,
          description,
          crop_id,
          technology_id,
          created_by,
          created_at,
          updated_at,
          crops(id, name),
          technologies(id, name)
        `)
        .order('name');

      if (error) throw error;

      return (data || []).map(variety => ({
        id: variety.id,
        name: variety.name,
        description: variety.description,
        cropId: variety.crop_id,
        technologyId: variety.technology_id,
        createdBy: variety.created_by,
        createdAt: variety.created_at,
        updatedAt: variety.updated_at,
        crop: variety.crops ? {
          name: variety.crops.name
        } : undefined,
        technology: variety.technologies ? {
          name: variety.technologies.name
        } : undefined
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
