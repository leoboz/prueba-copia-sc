import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export interface VarietyPermission {
  id: string;
  varietyId: string;
  userId: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  constraints?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  variety?: {
    name: string;
    crop?: {
      name: string;
    }
  };
  user?: {
    name: string;
    email: string;
  };
}

export const useVarietyPermissions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    data: grantedPermissions,
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions,
  } = useQuery({
    queryKey: ['granted-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID, returning empty permissions');
        return [];
      }

      const { data: varietyIds, error: varietyError } = await supabase
        .from('varieties')
        .select('id')
        .eq('created_by', user.id);

      if (varietyError) {
        console.error('Variety fetch error:', varietyError.message, varietyError);
        setError(varietyError.message);
        throw varietyError;
      }

      console.log('Fetched variety IDs:', varietyIds);

      if (!varietyIds.length) {
        console.log('No varieties found for user, returning empty permissions');
        return [];
      }

      const { data: permissions, error: permissionError } = await supabase
        .from('variety_permissions')
        .select(`
          id,
          variety_id,
          user_id,
          granted_by,
          granted_at,
          expires_at,
          constraints,
          created_at,
          updated_at
        `)
        .in('variety_id', varietyIds.map(v => v.id));

      if (permissionError) {
        console.error('Permissions fetch error:', permissionError.message, permissionError);
        setError(permissionError.message);
        throw permissionError;
      }

      console.log('Fetched raw permissions:', permissions);

      if (!permissions.length) {
        console.log('No permissions found, returning empty');
        return [];
      }

      const varietyIdSet = [...new Set(permissions.map(p => p.variety_id))];
      const { data: varietiesData, error: varietyDetailsError } = await supabase
        .from('varieties')
        .select(`
          id,
          name,
          crop:crops(name)
        `)
        .in('id', varietyIdSet);

      if (varietyDetailsError) {
        console.error('Variety details fetch error:', varietyDetailsError.message, varietyDetailsError);
        setError(varietyDetailsError.message);
        throw varietyDetailsError;
      }

      const varieties = varietiesData || [];
      console.log('Fetched varieties:', varieties);

      const userIdSet = [...new Set(permissions.map(p => p.user_id))];
      const { data: usersData, error: userDetailsError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', userIdSet);

      if (userDetailsError) {
        console.error('User details fetch error:', userDetailsError.message, userDetailsError);
        setError(userDetailsError.message);
        throw userDetailsError;
      }

      const users = usersData || [];
      console.log('Fetched users:', users);

      return permissions.map(permission => {
        const variety = varieties.find(v => v.id === permission.variety_id) || { name: 'Unknown', crop: { name: 'Unknown' } };
        const user = users.find(u => u.id === permission.user_id) || { name: 'Unknown', email: 'Unknown' };
        return {
          id: permission.id,
          varietyId: permission.variety_id,
          userId: permission.user_id,
          grantedBy: permission.granted_by,
          grantedAt: permission.granted_at,
          expiresAt: permission.expires_at,
          constraints: permission.constraints,
          createdAt: permission.created_at,
          updatedAt: permission.updated_at,
          variety: {
            name: variety.name,
            crop: variety.crop
          },
          user: {
            name: user.name,
            email: user.email
          }
        };
      }) as VarietyPermission[];
    },
    enabled: !!user?.id && user?.role === 'geneticsCompany',
    refetchOnMount: true,
  });

  const grantPermission = useMutation({
    mutationFn: async (permission: {
      varietyId: string;
      userId: string;
      expiresAt?: string;
      constraints?: Record<string, any>;
    }) => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const dbPermission = {
        variety_id: permission.varietyId,
        user_id: permission.userId,
        granted_by: user.id,
        expires_at: permission.expiresAt,
        constraints: permission.constraints
      };

      console.log('Inserting permission:', dbPermission);

      const { data, error } = await supabase
        .from('variety_permissions')
        .insert(dbPermission)
        .select(`
          id,
          variety_id,
          user_id,
          granted_by,
          granted_at,
          expires_at,
          constraints,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        console.error('Insert permission error:', error.message, error);
        setError(error.message);
        throw error;
      }

      return {
        id: data.id,
        varietyId: data.variety_id,
        userId: data.user_id,
        grantedBy: data.granted_by,
        grantedAt: data.granted_at,
        expiresAt: data.expires_at,
        constraints: data.constraints,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as VarietyPermission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['granted-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-varieties'] });
      toast({
        title: 'Permiso concedido',
        description: 'El permiso ha sido concedido exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('Grant permission error:', error.message, error);
      toast({
        title: 'Error al conceder permiso',
        description: error.message || 'No se pudo conceder el permiso.',
        variant: 'destructive',
      });
    },
  });

  const revokePermission = useMutation({
    mutationFn: async (permissionId: string) => {
      const { error } = await supabase
        .from('variety_permissions')
        .delete()
        .eq('id', permissionId);

      if (error) {
        console.error('Revoke permission error:', error.message, error);
        setError(error.message);
        throw error;
      }

      return { id: permissionId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['granted-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-varieties'] });
      toast({
        title: 'Permiso revocado',
        description: 'El permiso ha sido revocado exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('Revoke permission error:', error.message, error);
      toast({
        title: 'Error al revocar permiso',
        description: error.message || 'No se pudo revocar el permiso.',
        variant: 'destructive',
      });
    },
  });

  const checkPermission = async (varietyId: string, userId: string) => {
    const { data, error } = await supabase
      .from('variety_permissions')
      .select('*')
      .eq('variety_id', varietyId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Check permission error:', error.message, error);
      setError(error.message);
      throw error;
    }

    return !!data;
  };

  return {
    grantedPermissions,
    isLoadingPermissions,
    grantPermission,
    revokePermission,
    checkPermission,
    refetchPermissions,
    error,
  };
};