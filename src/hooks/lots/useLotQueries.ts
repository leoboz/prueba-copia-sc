
import { useQuery } from '@tanstack/react-query';
import { fetchLots } from './fetchLots';
import { fetchLotByCode } from './fetchLotByCode';

export const useLotsQuery = () => {
  return useQuery({
    queryKey: ['lots'],
    queryFn: fetchLots,
  });
};

export const useLotByCodeQuery = (code: string | null) => {
  return useQuery({
    queryKey: ['lot', code],
    queryFn: () => fetchLotByCode(code || ''),
    enabled: !!code, // Only run query if code is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
