import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Lot, LotStatus } from '@/types';
import { generateQRCodeForLot } from '@/utils/qrCode';

export interface CreateLotData {
  code: string;
  varietyId: string;
  userId: string;
  status?: LotStatus;
  plantId?: string;
  campaignId?: string;
  categoryId?: string;
  unitId?: string;
  lotTypeId?: string;
  originLotId?: string;
  originText?: string;
  amount?: number;
}

export interface UpdateLotData {
  id: string;
  code?: string;
  varietyId?: string;
  status?: LotStatus;
  plantId?: string;
  campaignId?: string;
  categoryId?: string;
  unitId?: string;
  lotTypeId?: string;
  originLotId?: string;
  originText?: string;
  amount?: number;
}

export const useLotMutations = () => {
  const queryClient = useQueryClient();

  const createLot = useMutation({
    mutationFn: async (lotData: CreateLotData) => {
      const { data, error } = await supabase
        .from('lots')
        .insert([{
          code: lotData.code,
          variety_id: lotData.varietyId,
          user_id: lotData.userId,
          plant_id: lotData.plantId,
          campaign_id: lotData.campaignId,
          category_id: lotData.categoryId,
          unit_id: lotData.unitId,
          lot_type_id: lotData.lotTypeId,
          origin_lot_id: lotData.originLotId,
          origin_text: lotData.originText,
          amount: lotData.amount,
        }])
        .select()
        .single();

      if (error) throw error;

      // Generate QR code after lot creation
      console.log(`🔗 Generating QR code for lot ${data.code} (ID: ${data.id})`);
      try {
        const qrUrl = await generateQRCodeForLot(data.code);
        console.log(`✅ Generated QR URL: ${qrUrl}`);
        
        // Update the lot with the QR URL
        const { error: qrUpdateError } = await supabase
          .from('lots')
          .update({ qr_url: qrUrl })
          .eq('id', data.id);

        if (qrUpdateError) {
          console.error('Error updating lot with QR URL:', qrUpdateError);
          // Don't throw error here as lot creation was successful
        } else {
          console.log(`✅ Updated lot ${data.id} with QR URL`);
          data.qr_url = qrUrl; // Update the returned data
        }
      } catch (qrError) {
        console.error('Error generating QR code:', qrError);
        // Don't throw error here as lot creation was successful
      }

      // Return complete Lot object with required fields
      return {
        id: data.id,
        code: data.code,
        varietyId: data.variety_id,
        userId: data.user_id,
        status: 'retenido' as LotStatus,
        overridden: data.overridden || false,
        overrideReason: data.override_reason || '',
        overriddenBy: data.overridden_by || '',
        qrUrl: data.qr_url || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        plantId: data.plant_id,
        campaignId: data.campaign_id,
        categoryId: data.category_id,
        unitId: data.unit_id,
        lotTypeId: data.lot_type_id,
        originLotId: data.origin_lot_id,
        originText: data.origin_text,
        calculatedLabelId: data.calculated_label_id,
        finalLabelId: data.final_label_id,
        pgoOverrideReason: data.pgo_override_reason,
        pgoOverriddenBy: data.pgo_overridden_by,
        pgoOverriddenAt: data.pgo_overridden_at,
        amount: data.amount,
        samples: [],
        media: []
      } as Lot;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      toast({
        title: "Éxito",
        description: "Lote creado correctamente",
      });
    },
    onError: (error) => {
      console.error('Error creating lot:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el lote",
        variant: "destructive",
      });
    },
  });

  const updateLot = useMutation({
    mutationFn: async (lotData: UpdateLotData) => {
      const { data, error } = await supabase
        .from('lots')
        .update({
          code: lotData.code,
          variety_id: lotData.varietyId,
          plant_id: lotData.plantId,
          campaign_id: lotData.campaignId,
          category_id: lotData.categoryId,
          unit_id: lotData.unitId,
          lot_type_id: lotData.lotTypeId,
          origin_lot_id: lotData.originLotId,
          origin_text: lotData.originText,
          amount: lotData.amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lotData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      toast({
        title: "Éxito",
        description: "Lote actualizado correctamente",
      });
    },
    onError: (error) => {
      console.error('Error updating lot:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el lote",
        variant: "destructive",
      });
    },
  });

  const deleteLot = useMutation({
    mutationFn: async (lotId: string) => {
      const { error } = await supabase
        .from('lots')
        .delete()
        .eq('id', lotId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      toast({
        title: "Éxito",
        description: "Lote eliminado correctamente",
      });
    },
    onError: (error) => {
      console.error('Error deleting lot:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el lote",
        variant: "destructive",
      });
    },
  });

  return {
    createLot,
    updateLot,
    deleteLot,
  };
};

// Export individual hooks for convenience
export const useCreateLot = () => {
  const { createLot } = useLotMutations();
  return createLot;
};

export const useUpdateLotStatus = () => {
  const { updateLot } = useLotMutations();
  return updateLot;
};
