import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface LotLabel {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PGOOverride {
  lotId: string;
  reason: string;
  overriddenBy: string;
  overriddenAt: string;
}

export const useLotLabels = () => {
  const queryClient = useQueryClient();

  // Fetch all lot labels
  const { data: labels, isLoading: isLoadingLabels, error } = useQuery({
    queryKey: ['lotLabels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lot_labels')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('DEBUG: useLotLabels query error:', error.message);
        throw error;
      }
      console.log('DEBUG: useLotLabels fetched:', data);
      return data as LotLabel[];
    },
    refetchOnMount: true, // Ensure fresh data on mount
    retry: 2, // Retry on failure
  });

  // Log errors if query fails
  useEffect(() => {
    if (error) {
      console.error('DEBUG: useLotLabels failed:', error.message);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las etiquetas de lote',
        variant: 'destructive',
      });
    }
  }, [error]);

  // Apply PGO override mutation
  const applyPGOOverride = useMutation({
    mutationFn: async ({ lotId, reason }: { lotId: string; reason: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get PGO label ID
      const { data: pgoLabel, error: labelError } = await supabase
        .from('lot_labels')
        .select('id')
        .eq('name', 'PGO')
        .single();

      if (labelError) throw labelError;

      const { error } = await supabase
        .from('lots')
        .update({
          final_label_id: pgoLabel.id,
          pgo_override_reason: reason,
          pgo_overridden_by: user.user.id,
          pgo_overridden_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', lotId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      toast({
        title: 'Éxito',
        description: 'Override PGO aplicado correctamente',
      });
    },
    onError: (error) => {
      console.error('Error applying PGO override:', error);
      toast({
        title: 'Error',
        description: 'No se pudo aplicar el override PGO',
        variant: 'destructive',
      });
    },
  });

  // Remove PGO override mutation
  const removePGOOverride = useMutation({
    mutationFn: async (lotId: string) => {
      const { error } = await supabase
        .from('lots')
        .update({
          final_label_id: null,
          pgo_override_reason: null,
          pgo_overridden_by: null,
          pgo_overridden_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lotId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      toast({
        title: 'Éxito',
        description: 'Override PGO removido correctamente',
      });
    },
    onError: (error) => {
      console.error('Error removing PGO override:', error);
      toast({
        title: 'Error',
        description: 'No se pudo remover el override PGO',
        variant: 'destructive',
      });
    },
  });

  return {
    labels,
    isLoadingLabels,
    error,
    applyPGOOverride,
    removePGOOverride,
  };
};