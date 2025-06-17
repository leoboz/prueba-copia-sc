
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Campaign } from '@/types/master-data';

export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async (): Promise<Campaign[]> => {
      console.log('Fetching campaigns...');
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      console.log('Fetched campaigns:', data);
      
      return (data || []).map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at,
      }));
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
