
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LotType, LotTypeUnitPermission } from '@/types/master-data';

export const useLotTypes = () => {
  return useQuery({
    queryKey: ['lot-types'],
    queryFn: async (): Promise<LotType[]> => {
      console.log('Fetching lot types...');
      
      const { data, error } = await supabase
        .from('lot_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching lot types:', error);
        throw error;
      }

      console.log('Fetched lot types:', data);
      
      return (data || []).map(lotType => ({
        id: lotType.id,
        name: lotType.name,
      }));
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLotTypeUnitPermissions = () => {
  return useQuery({
    queryKey: ['lot-type-unit-permissions'],
    queryFn: async (): Promise<LotTypeUnitPermission[]> => {
      console.log('Fetching lot type unit permissions...');
      
      const { data, error } = await supabase
        .from('lot_type_unit_permissions')
        .select('*');

      if (error) {
        console.error('Error fetching lot type unit permissions:', error);
        throw error;
      }

      console.log('Fetched lot type unit permissions:', data);
      
      return (data || []).map(permission => ({
        id: permission.id,
        lotTypeId: permission.lot_type_id,
        unitId: permission.unit_id,
        isAllowed: permission.is_allowed,
      }));
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
