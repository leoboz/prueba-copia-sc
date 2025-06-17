
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMenuPermissions } from '@/hooks/useMenuPermissions';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, Users, Settings, Menu } from 'lucide-react';

const MenuManagement = () => {
  const { 
    allPermissions, 
    isLoadingAllPermissions, 
    updateMenuPermission 
  } = useMenuPermissions();

  const [loadingUpdates, setLoadingUpdates] = useState<Record<string, boolean>>({});

  const handlePermissionToggle = async (permissionId: string, currentValue: boolean) => {
    setLoadingUpdates(prev => ({ ...prev, [permissionId]: true }));
    
    try {
      await updateMenuPermission.mutateAsync({
        permissionId: permissionId,
        isVisible: !currentValue
      });
    } catch (error) {
      console.error('Error updating permission:', error);
    } finally {
      setLoadingUpdates(prev => ({ ...prev, [permissionId]: false }));
    }
  };

  if (isLoadingAllPermissions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
        <div className="p-6 max-w-6xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
            <p className="text-navy-700">Cargando permisos del menú...</p>
          </Card>
        </div>
      </div>
    );
  }

  // Group permissions by role
  const permissionsByRole = allPermissions?.reduce((acc, permission) => {
    const role = permission.role || 'unknown';
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(permission);
    return acc;
  }, {} as Record<string, typeof allPermissions>) || {};

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-500 text-white hover:bg-red-600',
      multiplier: 'bg-navy-600 text-white hover:bg-navy-700',
      geneticsCompany: 'bg-navy-500 text-white hover:bg-navy-600',
      lab: 'bg-navy-400 text-white hover:bg-navy-500',
      farmer: 'bg-emerald-500 text-white hover:bg-emerald-600'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  const getRoleDisplayName = (role: string) => {
    const names = {
      admin: 'Administrador',
      multiplier: 'Multiplicador',
      geneticsCompany: 'Empresa Genética',
      lab: 'Laboratorio',
      farmer: 'Agricultor'
    };
    return names[role as keyof typeof names] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-serif flex items-center mb-2">
                  <Menu className="mr-4 h-10 w-10" />
                  Gestión de Menú
                </h1>
                <p className="text-navy-100 text-lg">
                  Configure qué elementos del menú pueden ver cada rol de usuario
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {Object.entries(permissionsByRole).map(([role, permissions]) => (
            <Card key={role} className="navy-card">
              <CardHeader className="bg-gradient-to-r from-navy-50 to-navy-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="mr-3 h-5 w-5 text-navy-600" />
                    <span className="text-xl font-serif text-navy-900">
                      {getRoleDisplayName(role)}
                    </span>
                    <Badge className={`ml-3 ${getRoleBadgeColor(role)}`}>
                      {permissions?.length || 0} permisos
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permissions?.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-navy-200/40 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-navy-900">
                          {permission.menu_item?.name || 'Elemento sin nombre'}
                        </h4>
                        <p className="text-sm text-navy-600">
                          {permission.menu_item?.href || 'Sin ruta'}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center">
                        {loadingUpdates[permission.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin text-navy-600" />
                        ) : (
                          <Switch
                            checked={permission.is_visible}
                            onCheckedChange={() => 
                              handlePermissionToggle(permission.id, permission.is_visible)
                            }
                            className="data-[state=checked]:bg-navy-600"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {(!permissions || permissions.length === 0) && (
                  <div className="text-center py-8 text-navy-600">
                    <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No hay permisos configurados para este rol</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {(!allPermissions || allPermissions.length === 0) && (
          <Card className="navy-card p-8 text-center">
            <Settings className="mx-auto h-16 w-16 mb-4 text-navy-300" />
            <h3 className="text-lg font-medium font-serif text-navy-900 mb-2">
              No hay permisos configurados
            </h3>
            <p className="text-navy-600">
              Configure los permisos del menú para diferentes roles de usuario
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
