import { supabase } from '@/integrations/supabase/client';
import { buildLotQuery } from './utils/lotQueryBuilder';
import { transformLotsData } from './utils/lotDataTransformer';
import { RawLotData } from './types/lotTransformTypes';

export const fetchLotByCode = async (codeOrId: string) => {
  console.log('Fetching lot by code or ID:', codeOrId);
  
  // Check if the input looks like a UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(codeOrId);
  
  let query = supabase
    .from('lots')
    .select(buildLotQuery());
  
  if (isUUID) {
    // If it's a UUID, search by ID first
    query = query.eq('id', codeOrId);
  } else {
    // Otherwise search by code
    query = query.eq('code', codeOrId);
  }
  
  const { data, error } = await query.single();

  if (error) {
    console.error('Error fetching lot:', error);
    
    // If UUID search failed, try searching by code
    if (isUUID && error.code === 'PGRST116') {
      console.log('UUID search failed, trying by code...');
      const { data: codeData, error: codeError } = await supabase
        .from('lots')
        .select(buildLotQuery())
        .eq('code', codeOrId)
        .single();
        
      if (codeError) {
        console.error('Code search also failed:', codeError);
        throw codeError;
      }
      
      console.log('Found lot by code:', codeData);
      return transformLotsData([codeData as unknown as RawLotData])[0];
    }
    
    throw error;
  }

  console.log('Found lot:', data);
  return transformLotsData([data as unknown as RawLotData])[0];
};
