
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lot } from '@/types';

interface UseOriginLotFiltersParams {
  currentLotTypeId?: string;
  searchCode?: string;
  varietyId?: string;
  categoryId?: string;
  plantId?: string;
  campaignId?: string;
}

export const useOriginLotFilters = (params: UseOriginLotFiltersParams = {}) => {
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Fetch available lots that can be used as origin
  const { data: lotsData, isLoading } = useQuery({
    queryKey: ['originLots', params, page],
    queryFn: async () => {
      let query = supabase
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
        `);

      // Apply filters
      if (params.searchCode) {
        query = query.ilike('code', `%${params.searchCode}%`);
      }
      if (params.varietyId) {
        query = query.eq('variety_id', params.varietyId);
      }
      if (params.categoryId) {
        query = query.eq('category_id', params.categoryId);
      }
      if (params.plantId) {
        query = query.eq('plant_id', params.plantId);
      }
      if (params.campaignId) {
        query = query.eq('campaign_id', params.campaignId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      return data || [];
    },
  });

  // Fetch filter options
  const { data: varieties } = useQuery({
    queryKey: ['varietiesForOrigin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('varieties')
        .select('id, name, crop:crops(name)')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categoriesForOrigin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const { data: plants } = useQuery({
    queryKey: ['plantsForOrigin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const { data: campaigns } = useQuery({
    queryKey: ['campaignsForOrigin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Map database results to Lot interface
  const lots = (lotsData || []).map(lot => ({
    id: lot.id,
    code: lot.code,
    varietyId: lot.variety_id,
    userId: lot.user_id,
    status: 'retenido' as const, // Default status for compatibility
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

  const hasMore = lotsData ? lotsData.length === pageSize : false;

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const filters = {
    varieties: varieties || [],
    categories: categories || [],
    plants: plants || [],
    campaigns: campaigns || []
  };

  return {
    lots,
    isLoading,
    hasMore,
    loadMore,
    filters
  };
};
