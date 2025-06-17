
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, UserCompanyAssociation, UserSession } from '@/types/company';
import { 
  transformCompany, 
  transformUserCompanyAssociation, 
  transformUserSession 
} from '@/utils/dataTransformers';

export const useUserCompanies = () => {
  return useQuery({
    queryKey: ['user-companies'],
    queryFn: async () => {
      const { data: associations, error } = await supabase
        .from('user_company_associations')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('is_active', true);

      if (error) throw error;
      return associations?.map(transformUserCompanyAssociation) || [];
    },
  });
};

export const useActiveCompany = () => {
  return useQuery({
    queryKey: ['active-company'],
    queryFn: async () => {
      const { data: session, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          company:companies(*)
        `)
        .single();

      if (error) throw error;
      return transformUserSession(session);
    },
  });
};

export const useSwitchCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: user.id,
          active_company_id: companyId,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return companyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-company'] });
      queryClient.invalidateQueries({ queryKey: ['user-companies'] });
      // Invalidate all data queries to refresh with new company context
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      queryClient.invalidateQueries({ queryKey: ['varieties'] });
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });
};

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data?.map(transformCompany) || [];
    },
  });
};
