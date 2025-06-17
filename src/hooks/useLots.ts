
import { useState, useCallback } from 'react';
import { useLotsQuery, useLotByCodeQuery } from './lots/useLotQueries';
import { useCreateLot, useUpdateLotStatus } from './lots/lotMutations';
import { fetchLotByCode } from './lots/fetchLotByCode';
import { useAuth } from '@/context/AuthContext';

export const useLots = () => {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const {
    data: lots,
    isLoading,
    refetch,
  } = useLotsQuery();

  // Filter lots for multiplier users
  const multiplierLots = lots?.filter(lot => lot.userId === user?.id) || [];
  const isLoadingMultiplierLots = isLoading;

  // Cached getLotByCode function using React Query
  const useLotByCode = useLotByCodeQuery;

  // Keep the original callback for backwards compatibility
  const getLotByCode = useCallback(fetchLotByCode, []);

  const createLot = useCreateLot();
  const updateLotStatus = useUpdateLotStatus();

  return {
    lots,
    multiplierLots,
    isLoading,
    isLoadingMultiplierLots,
    error,
    getLotByCode,
    useLotByCode, // New cached hook
    createLot,
    updateLotStatus,
    refetch,
  };
};
