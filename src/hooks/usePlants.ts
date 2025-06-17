
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plant } from '@/types/master-data';
import { useAuth } from '@/context/AuthContext';

export const usePlants = () => {
  return useQuery({
    queryKey: ['plants'],
    queryFn: async (): Promise<Plant[]> => {
      console.log('Fetching plants...');
      
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching plants:', error);
        throw error;
      }

      console.log('Fetched plants:', data);
      
      return (data || []).map(plant => ({
        id: plant.id,
        name: plant.name,
        multiplierId: plant.multiplier_id,
        isVerified: plant.is_verified,
        createdAt: plant.created_at,
        updatedAt: plant.updated_at,
      }));
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePlant = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (plantData: { name: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('plants')
        .insert({
          name: plantData.name,
          multiplier_id: user.id,
          is_verified: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating plant:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });
};

export const useUpdatePlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string; name?: string; isVerified?: boolean }) => {
      const { data, error } = await supabase
        .from('plants')
        .update({
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.isVerified !== undefined && { is_verified: updateData.isVerified }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating plant:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });
};
