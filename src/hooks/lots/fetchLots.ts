
import { supabase } from '@/integrations/supabase/client';
import { Lot } from '@/types';
import { buildLotQuery } from './utils/lotQueryBuilder';
import { transformLotsData } from './utils/lotDataTransformer';
import { RawLotData } from './types/lotTransformTypes';

export const fetchLots = async (): Promise<Lot[]> => {
  console.log('Fetching lots from database...');

  const { data, error } = await supabase
    .from('lots')
    .select(buildLotQuery())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lots:', error);
    throw error;
  }

  console.log(`Fetched ${data?.length || 0} lots from database`);

  // Use proper type assertion to handle Supabase data
  return transformLotsData((data || []) as unknown as RawLotData[]);
};
