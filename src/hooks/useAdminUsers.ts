
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  requires_password_change: boolean | null;
}

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Users fetch error:', error);
        throw error;
      }
      return data as AdminUser[];
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Update user role error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Éxito",
        description: "Rol de usuario actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario",
        variant: "destructive",
      });
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Toggle user status error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Éxito",
        description: "Estado del usuario actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Starting user deletion process for:', userId);
      
      try {
        // First, deactivate all user-company associations
        console.log('Deactivating user associations...');
        const { error: associationsError } = await supabase
          .from('user_company_associations')
          .update({ is_active: false })
          .eq('user_id', userId);
        
        if (associationsError) {
          console.error('Error deactivating user associations:', associationsError);
          throw new Error('No se pudieron desactivar las asociaciones del usuario');
        }
        
        // Delete user sessions
        console.log('Deleting user sessions...');
        const { error: sessionsError } = await supabase
          .from('user_sessions')
          .delete()
          .eq('user_id', userId);
        
        if (sessionsError) {
          console.error('Error deleting user sessions:', sessionsError);
          // Don't throw here as this table might not exist or be empty
        }
        
        // Delete user activity logs
        console.log('Deleting user activity logs...');
        const { error: activityError } = await supabase
          .from('user_activity_logs')
          .delete()
          .eq('user_id', userId);
        
        if (activityError) {
          console.error('Error deleting user activity logs:', activityError);
          // Don't throw here as this is not critical
        }
        
        // Delete variety permissions
        console.log('Deleting variety permissions...');
        const { error: permissionsError } = await supabase
          .from('variety_permissions')
          .delete()
          .eq('user_id', userId);
        
        if (permissionsError) {
          console.error('Error deleting variety permissions:', permissionsError);
          // Don't throw here as this is not critical
        }
        
        // Finally, delete the user from the users table
        console.log('Deleting user record...');
        const { error: userError } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);
        
        if (userError) {
          console.error('Error deleting user:', userError);
          throw new Error('No se pudo eliminar el usuario: ' + userError.message);
        }
        
        console.log('User deletion completed successfully for:', userId);
        return { success: true };
        
      } catch (error: any) {
        console.error('User deletion failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate all related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-company-associations'] });
      queryClient.invalidateQueries({ queryKey: ['all-user-company-associations'] });
      
      toast({
        title: "Éxito",
        description: "Usuario eliminado exitosamente del sistema",
      });
    },
    onError: (error: any) => {
      console.error('Delete user mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    },
  });

  return {
    users,
    isLoadingUsers,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
  };
};
