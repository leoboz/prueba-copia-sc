
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lot } from '@/types';

// Define LotTypeName locally since it's not exported from master-data
type LotTypeName = 'SILOBOLSA' | 'INGRESO' | 'PROCESO INTERMEDIO' | 'EMBOLSE FINAL';

interface LotType {
  id: string;
  name: string;
}

interface UseParentLotsParams {
  varietyId?: string;
  categoryId?: string;
  plantId?: string;
  campaignId?: string;
  currentLotTypeName?: LotTypeName;
  lotTypes?: LotType[];
}

export const useParentLots = (params: UseParentLotsParams = {}) => {
  const { varietyId, categoryId, plantId, campaignId, currentLotTypeName, lotTypes } = params;

  return useQuery({
    queryKey: ['parentLots', varietyId, categoryId, plantId, campaignId, currentLotTypeName],
    queryFn: async () => {
      if (!varietyId || !categoryId || !plantId) return [];

      // Get compatible lot types based on current lot type
      let compatibleLotTypeNames: LotTypeName[] = [];
      
      switch (currentLotTypeName) {
        case 'SILOBOLSA':
          compatibleLotTypeNames = []; // SILOBOLSA doesn't inherit from other lots
          break;
        case 'INGRESO':
          compatibleLotTypeNames = ['SILOBOLSA'];
          break;
        case 'PROCESO INTERMEDIO':
          compatibleLotTypeNames = ['SILOBOLSA', 'INGRESO'];
          break;
        case 'EMBOLSE FINAL':
          compatibleLotTypeNames = ['SILOBOLSA', 'INGRESO', 'PROCESO INTERMEDIO'];
          break;
        default:
          compatibleLotTypeNames = [];
      }

      if (compatibleLotTypeNames.length === 0) return [];

      // Get lot type IDs for compatible types
      const compatibleLotTypeIds = lotTypes
        ?.filter(lt => compatibleLotTypeNames.includes(lt.name as LotTypeName))
        .map(lt => lt.id) || [];

      if (compatibleLotTypeIds.length === 0) return [];

      const { data, error } = await supabase
        .from('lots')
        .select(`
          id,
          code,
          variety_id,
          user_id,
          overridden,
          override_reason,
          overridden_by,
          qr_url,
          created_at,
          updated_at,
          plant_id,
          campaign_id,
          category_id,
          unit_id,
          lot_type_id,
          origin_lot_id,
          origin_text,
          calculated_label_id,
          final_label_id,
          pgo_override_reason,
          pgo_overridden_by,
          pgo_overridden_at,
          amount,
          variety:varieties(
            id,
            name,
            crop:crops(name)
          ),
          category:categories(
            id,
            name
          ),
          plant:plants(
            id,
            name
          ),
          campaign:campaigns(
            id,
            name
          )
        `)
        .eq('variety_id', varietyId)
        .eq('category_id', categoryId)
        .eq('plant_id', plantId)
        .in('lot_type_id', compatibleLotTypeIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(lot => ({
        id: lot.id,
        code: lot.code,
        varietyId: lot.variety_id,
        userId: lot.user_id,
        status: 'retenido' as const,
        overridden: lot.overridden || false,
        overrideReason: lot.override_reason || '',
        overriddenBy: lot.overridden_by || '',
        qrUrl: lot.qr_url || '',
        createdAt: lot.created_at,
        updatedAt: lot.updated_at,
        plantId: lot.plant_id,
        campaignId: lot.campaign_id,
        categoryId: lot.category_id,
        unitId: lot.unit_id,
        lotTypeId: lot.lot_type_id,
        originLotId: lot.origin_lot_id,
        originText: lot.origin_text,
        calculatedLabelId: lot.calculated_label_id,
        finalLabelId: lot.final_label_id,
        pgoOverrideReason: lot.pgo_override_reason,
        pgoOverriddenBy: lot.pgo_overridden_by,
        pgoOverriddenAt: lot.pgo_overridden_at,
        amount: lot.amount,
        variety: lot.variety ? {
          id: lot.variety.id,
          name: lot.variety.name,
          description: '',
          cropId: '',
          technologyId: undefined,
          createdBy: '',
          createdAt: '',
          updatedAt: '',
          crop: lot.variety.crop ? {
            name: lot.variety.crop.name
          } : undefined
        } : undefined,
        category: lot.category ? {
          id: lot.category.id,
          name: lot.category.name,
          createdAt: '',
          updatedAt: ''
        } : undefined,
        plant: lot.plant ? {
          id: lot.plant.id,
          name: lot.plant.name,
          multiplierId: '',
          isVerified: false,
          createdAt: '',
          updatedAt: ''
        } : undefined,
        campaign: lot.campaign ? {
          id: lot.campaign.id,
          name: lot.campaign.name,
          createdAt: '',
          updatedAt: ''
        } : undefined,
        samples: [],
        media: []
      })) as Lot[];
    },
    enabled: !!(varietyId && categoryId && plantId && currentLotTypeName && lotTypes),
  });
};
