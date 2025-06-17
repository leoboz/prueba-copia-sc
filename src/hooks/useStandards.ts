
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface CriteriaType {
  min?: number;
  max?: number;
}

export const useStandards = () => {
  const queryClient = useQueryClient();

  const { data: standards, isLoading } = useQuery({
    queryKey: ['standards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('standards')
        .select(`
          id, 
          test_id, 
          parameter_id, 
          label_id, 
          criteria, 
          created_by, 
          created_at, 
          updated_at,
          sample_labels!inner(
            id,
            name
          ),
          parameters!inner(
            id,
            name
          )
        `);
      if (error) {
        console.error('Standards fetch error:', error.message, error);
        throw error;
      }
      console.log('Fetched standards with complete info:', data);
      return data;
    },
  });

  const createStandard = useMutation({
    mutationFn: async (standardData: {
      testId: string;
      parameterId: string;
      labelId: string;
      criteria: CriteriaType;
      createdBy: string;
    }) => {
      console.log('Creating standard with data:', standardData);
      
      const dbStandard = {
        test_id: standardData.testId,
        parameter_id: standardData.parameterId,
        label_id: standardData.labelId,
        criteria: standardData.criteria as unknown as Json,
        created_by: standardData.createdBy,
      };
      
      const { data, error } = await supabase
        .from('standards')
        .insert(dbStandard)
        .select()
        .single();
        
      if (error) {
        console.error('Create standard error:', error.message, error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      queryClient.invalidateQueries({ queryKey: ['parameters-for-standards'] });
      toast({
        title: "Éxito",
        description: "Estándar creado exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Create standard error:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el estándar",
        variant: "destructive",
      });
    },
  });

  const updateStandard = useMutation({
    mutationFn: async (standardData: {
      standardId: string;
      criteria: CriteriaType;
    }) => {
      console.log('Updating standard with data:', standardData);
      
      const { data, error } = await supabase
        .from('standards')
        .update({
          criteria: standardData.criteria as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', standardData.standardId)
        .select()
        .single();
        
      if (error) {
        console.error('Update standard error:', error.message, error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      queryClient.invalidateQueries({ queryKey: ['parameters-for-standards'] });
      toast({
        title: "Éxito",
        description: "Estándar actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Update standard error:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estándar",
        variant: "destructive",
      });
    },
  });

  return {
    standards,
    isLoading,
    createStandard,
    updateStandard,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      queryClient.invalidateQueries({ queryKey: ['parameters-for-standards'] });
    },
  };
};
