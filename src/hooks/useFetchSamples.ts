
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sample } from '@/types';
import { withQueryLogging } from '@/integrations/supabase/queryLogger';

/**
 * Internal function to fetch samples data
 */
const _fetchSamples = async (): Promise<Sample[]> => {
  console.log('Fetching samples...');
  const { data, error } = await supabase
    .from('samples')
    .select(`
      id,
      lot_id,
      user_id,
      test_ids,
      status,
      estimated_result_date,
      created_at,
      updated_at,
      sample_type_id,
      internal_code,
      label_id,
      lot:lots(
        code, 
        user_id,
        variety:varieties(
          id,
          name,
          crop_id,
          created_by,
          created_at,
          updated_at,
          crop:crops(name)
        )
      )
    `);

  if (error) {
    console.error('Samples fetch error:', error.message, error);
    throw error;
  }

  console.log('Fetched samples:', data);

  // Fetch multiplier information for each sample
  const userIds = [...new Set(data.map(item => item.lot?.user_id).filter(Boolean))];
  let users = [];
  
  if (userIds.length > 0) {
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', userIds);
      
    if (!usersError) {
      users = usersData || [];
    }
  }

  // Map the query result to match the Sample interface
  return data.map(item => ({
    id: item.id,
    lotId: item.lot_id,
    userId: item.user_id,
    testIds: item.test_ids,
    status: item.status,
    sampleTypeId: item.sample_type_id,
    internal_code: item.internal_code,
    labelId: item.label_id,
    estimatedResultDate: item.estimated_result_date,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    lot: item.lot ? {
      code: item.lot.code,
      userId: item.lot.user_id,
      user: users.find(u => u.id === item.lot.user_id) || null,
      variety: item.lot.variety ? {
        id: item.lot.variety.id,
        name: item.lot.variety.name,
        cropId: item.lot.variety.crop_id,
        createdBy: item.lot.variety.created_by,
        createdAt: item.lot.variety.created_at,
        updatedAt: item.lot.variety.updated_at,
        crop: item.lot.variety.crop
      } : undefined
    } : null,
  })) as Sample[];
};

/**
 * Hook for fetching samples data
 */
export const useFetchSamples = () => {
  const { data: samples, isLoading } = useQuery({
    queryKey: ['samples'],
    queryFn: withQueryLogging('useFetchSamples', _fetchSamples),
    refetchOnMount: true,
  });

  return {
    samples,
    isLoading,
  };
};
