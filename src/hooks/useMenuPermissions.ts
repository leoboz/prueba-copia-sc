
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon_name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RoleMenuPermission {
  id: string;
  menu_item_id: string;
  role: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  menu_item?: MenuItem;
}

export const useMenuPermissions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userMenuItems, isLoading: isLoadingMenuItems } = useQuery({
    queryKey: ['user-menu-items', user?.role],
    queryFn: async () => {
      if (!user?.role) return [];

      const { data, error } = await supabase
        .from('role_menu_permissions')
        .select(`
          *,
          menu_item:menu_items(*)
        `)
        .eq('role', user.role)
        .eq('is_visible', true);

      if (error) {
        console.error('Error fetching user menu items:', error);
        throw error;
      }

      // Sort by menu_item sort_order manually since we can't do it in the query with joins
      const sortedData = (data as (RoleMenuPermission & { menu_item: MenuItem })[])
        .filter(item => item.menu_item && item.menu_item.is_active)
        .sort((a, b) => a.menu_item.sort_order - b.menu_item.sort_order);

      return sortedData;
    },
    enabled: !!user?.role,
  });

  const { data: allMenuItems, isLoading: isLoadingAllMenuItems } = useQuery({
    queryKey: ['all-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching all menu items:', error);
        throw error;
      }

      return data as MenuItem[];
    },
  });

  const { data: allPermissions, isLoading: isLoadingAllPermissions } = useQuery({
    queryKey: ['all-menu-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_menu_permissions')
        .select(`
          *,
          menu_item:menu_items(*)
        `);

      if (error) {
        console.error('Error fetching all permissions:', error);
        throw error;
      }

      // Sort by menu_item sort_order manually
      const sortedData = (data as (RoleMenuPermission & { menu_item: MenuItem })[])
        .filter(item => item.menu_item)
        .sort((a, b) => a.menu_item.sort_order - b.menu_item.sort_order);

      return sortedData;
    },
  });

  const updateMenuPermission = useMutation({
    mutationFn: async ({ permissionId, isVisible }: { permissionId: string; isVisible: boolean }) => {
      const { data, error } = await supabase
        .from('role_menu_permissions')
        .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
        .eq('id', permissionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating menu permission:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['all-menu-permissions'] });
      toast({
        title: "Éxito",
        description: "Permisos de menú actualizados exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudieron actualizar los permisos de menú",
        variant: "destructive",
      });
    },
  });

  const updateMenuItem = useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: string; updates: Partial<MenuItem> }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        console.error('Error updating menu item:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['user-menu-items'] });
      toast({
        title: "Éxito",
        description: "Elemento de menú actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el elemento de menú",
        variant: "destructive",
      });
    },
  });

  return {
    userMenuItems,
    isLoadingMenuItems,
    allMenuItems,
    isLoadingAllMenuItems,
    allPermissions,
    isLoadingAllPermissions,
    updateMenuPermission,
    updateMenuItem,
  };
};
