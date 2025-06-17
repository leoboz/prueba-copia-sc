import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Crop, Variety } from '@/types';

interface Technology {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const useGenetics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    data: companyVarieties,
    isLoading: isLoadingCompanyVarieties,
    refetch: refetchCompanyVarieties,
  } = useQuery({
    queryKey: ['company-varieties', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID, returning empty companyVarieties');
        return [];
      }

      console.log('User details for companyVarieties:', { id: user.id, role: user.role });

      if (user.role !== 'geneticsCompany') {
        console.log('User not a genetics company, returning empty companyVarieties');
        return [];
      }

      const { data, error } = await supabase
        .from('varieties')
        .select(`
          id,
          name,
          description,
          crop_id,
          technology_id,
          created_by,
          created_at,
          updated_at,
          crop:crops(name),
          technology:technologies(name)
        `)
        .eq('created_by', user.id);

      if (error) {
        console.error('Company varieties fetch error:', error.message, error);
        setError(error.message);
        throw error;
      }

      console.log('Fetched company varieties:', data);

      // Map the query result to match the Variety interface
      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        cropId: item.crop_id,
        technologyId: item.technology_id,
        createdBy: item.created_by,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        crop: item.crop,
        technology: item.technology
      })) as Variety[];
    },
    enabled: !!user?.id && user?.role === 'geneticsCompany',
    refetchOnMount: true,
  });

  const {
    data: crops,
    isLoading: isLoadingCrops,
    refetch: refetchCrops,
  } = useQuery({
    queryKey: ['crops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crops')
        .select(`
          id,
          name,
          scientific_name,
          created_at,
          updated_at
        `);

      if (error) {
        console.error('Crops fetch error:', error.message, error);
        setError(error.message);
        throw error;
      }

      console.log('Fetched crops:', data);

      // Map the query result to match the Crop interface
      return data.map(item => ({
        id: item.id,
        name: item.name,
        scientificName: item.scientific_name,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Crop[];
    },
    refetchOnMount: true,
  });

  const {
    data: technologies,
    isLoading: isLoadingTechnologies,
    refetch: refetchTechnologies,
  } = useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technologies')
        .select(`
          id,
          name,
          created_at,
          updated_at
        `);

      if (error) {
        console.error('Technologies fetch error:', error.message, error);
        setError(error.message);
        throw error;
      }

      console.log('Fetched technologies:', data);

      return data.map(item => ({
        id: item.id,
        name: item.name,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Technology[];
    },
    refetchOnMount: true,
  });

  const {
    data: multiplierVarieties,
    isLoading: isLoadingMultiplierVarieties,
    refetch: refetchMultiplierVarieties,
  } = useQuery({
    queryKey: ['multiplier-varieties', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID, returning empty multiplierVarieties');
        return [];
      }

      console.log('User details for multiplierVarieties:', { id: user.id, role: user.role });

      if (user.role !== 'multiplier') {
        console.log('User not a multiplier, returning empty multiplierVarieties');
        return [];
      }

      // Step 1: Fetch variety permissions with properly grouped expires_at condition
      const { data: permissions, error: permissionsError } = await supabase
        .from('variety_permissions')
        .select('variety_id')
        .eq('user_id', user.id)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      if (permissionsError) {
        console.error('Permissions fetch error:', permissionsError.message, permissionsError);
        setError(permissionsError.message);
        throw permissionsError;
      }

      console.log('Fetched variety permissions:', permissions);

      if (!permissions.length) {
        console.log('No permissions found, returning empty multiplierVarieties');
        return [];
      }

      // Step 2: Fetch variety details
      const varietyIds = permissions.map(p => p.variety_id).filter(id => id !== null);
      console.log('Extracted variety IDs:', varietyIds);

      if (!varietyIds.length) {
        console.log('No valid variety IDs, returning empty multiplierVarieties');
        return [];
      }

      const { data: varieties, error: varietiesError } = await supabase
        .from('varieties')
        .select(`
          id,
          name,
          description,
          crop_id,
          technology_id,
          created_by,
          created_at,
          updated_at
        `)
        .in('id', varietyIds);

      if (varietiesError) {
        console.error('Varieties fetch error:', varietiesError.message, varietiesError);
        setError(varietiesError.message);
        throw varietiesError;
      }

      console.log('Fetched multiplier varieties:', varieties);

      if (!varieties.length) {
        return [];
      }

      // Step 3: Fetch crops for the varieties
      const cropIds = [...new Set(varieties.map(v => v.crop_id).filter(id => id !== null))];
      const { data: crops, error: cropsError } = await supabase
        .from('crops')
        .select('id, name')
        .in('id', cropIds);

      if (cropsError) {
        console.error('Crops fetch error:', cropsError.message, cropsError);
        setError(cropsError.message);
        throw cropsError;
      }

      console.log('Fetched crops for multiplierVarieties:', crops);

      return varieties.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        cropId: item.crop_id,
        technologyId: item.technology_id,
        createdBy: item.created_by,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        crop: crops.find(c => c.id === item.crop_id) || { name: 'Unknown' }
      })) as Variety[];
    },
    enabled: !!user?.id && user?.role === 'multiplier',
    refetchOnMount: true,
  });

  const createVariety = useMutation({
    mutationFn: async (varietyData: Omit<Variety, 'id' | 'createdAt' | 'updatedAt' | 'crop' | 'technology'> & { technologyId?: string }) => {
      console.log('Creating variety with data:', varietyData);
      
      const { data, error } = await supabase
        .from('varieties')
        .insert({
          name: varietyData.name,
          description: varietyData.description,
          crop_id: varietyData.cropId,
          created_by: varietyData.createdBy,
          technology_id: varietyData.technologyId || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Create variety error:', error.message, error);
        setError(error.message);
        throw error;
      }

      console.log('Created variety:', data);

      // Map the query result to match the Variety interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        cropId: data.crop_id,
        technologyId: data.technology_id,
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Variety;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-varieties', user?.id] });
    },
  });

  const updateVariety = useMutation({
    mutationFn: async (varietyData: Variety & { technologyId?: string }) => {
      console.log('Updating variety with data:', varietyData);
      
      const { data, error } = await supabase
        .from('varieties')
        .update({
          name: varietyData.name,
          description: varietyData.description,
          crop_id: varietyData.cropId,
          technology_id: varietyData.technologyId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', varietyData.id)
        .select()
        .single();

      if (error) {
        console.error('Update variety error:', error.message, error);
        setError(error.message);
        throw error;
      }

      console.log('Updated variety:', data);

      // Map the query result to match the Variety interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        cropId: data.crop_id,
        technologyId: data.technology_id,
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Variety;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-varieties', user?.id] });
    },
  });

  return {
    companyVarieties,
    isLoadingCompanyVarieties,
    refetchCompanyVarieties,
    crops,
    isLoadingCrops,
    refetchCrops,
    technologies,
    isLoadingTechnologies,
    refetchTechnologies,
    multiplierVarieties,
    isLoadingMultiplierVarieties,
    refetchMultiplierVarieties,
    createVariety,
    updateVariety,
    error,
  };
};
