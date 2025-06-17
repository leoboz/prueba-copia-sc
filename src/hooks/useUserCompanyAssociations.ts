
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserCompanyAssociation } from '@/types/company';
import { transformUserCompanyAssociation } from '@/utils/dataTransformers';
import { toast } from '@/hooks/use-toast';

export const useUserCompanyAssociations = (userId: string) => {
  const queryClient = useQueryClient();

  const { data: userAssociations, isLoading, error } = useQuery({
    queryKey: ['user-company-associations', userId],
    queryFn: async () => {
      console.log('Fetching user associations for user:', userId);
      
      const { data, error } = await supabase
        .from('user_company_associations')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching user associations:', error);
        throw error;
      }
      
      console.log('Raw user associations data:', data);
      const transformed = data?.map(transformUserCompanyAssociation) || [];
      console.log('Transformed user associations:', transformed);
      
      return transformed;
    },
    enabled: !!userId,
  });

  const addAssociation = useMutation({
    mutationFn: async ({ userId, companyId, role }: { userId: string; companyId: string; role: string }) => {
      console.log('Adding association:', { userId, companyId, role });
      
      const { data, error } = await supabase
        .from('user_company_associations')
        .insert({
          user_id: userId,
          company_id: companyId,
          role,
          is_active: true
        })
        .select(`
          *,
          company:companies(*)
        `)
        .single();

      if (error) {
        console.error('Error adding association:', error);
        throw error;
      }
      
      console.log('Added association:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-company-associations', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Éxito",
        description: "Asociación de empresa agregada exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Add association error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar la asociación de empresa",
        variant: "destructive",
      });
    },
  });

  const removeAssociation = useMutation({
    mutationFn: async (associationId: string) => {
      console.log('Removing association:', associationId);
      
      const { error } = await supabase
        .from('user_company_associations')
        .update({ is_active: false })
        .eq('id', associationId);

      if (error) {
        console.error('Error removing association:', error);
        throw error;
      }
      
      console.log('Removed association:', associationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-company-associations', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Éxito",
        description: "Asociación de empresa eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Remove association error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la asociación de empresa",
        variant: "destructive",
      });
    },
  });

  return {
    userAssociations,
    isLoading,
    error,
    addAssociation,
    removeAssociation,
  };
};
