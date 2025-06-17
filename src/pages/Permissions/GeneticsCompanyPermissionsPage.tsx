
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { useGenetics } from '@/hooks/useGenetics';
import { useVarietyPermissions, VarietyPermission } from '@/hooks/useVarietyPermissions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, CheckIcon, XIcon, Clock, UserCheck, Shield, Users, Sprout } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const GeneticsCompanyPermissionsPage: React.FC = () => {
  const { user } = useAuth();
  const { companyVarieties, isLoadingCompanyVarieties } = useGenetics();
  const { multipliers: rawMultipliers, isLoadingMultipliers } = useUsers();
  const { 
    grantedPermissions, 
    isLoadingPermissions, 
    grantPermission,
    revokePermission,
    error
  } = useVarietyPermissions();

  const [selectedVarietyIds, setSelectedVarietyIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error al cargar permisos',
        description: error,
        variant: 'destructive',
      });
    }
    if (grantedPermissions?.length) {
      console.log('Fetched permissions:', grantedPermissions);
    }
  }, [error, grantedPermissions]);

  const handleGrantPermission = async () => {
    if (selectedVarietyIds.length === 0 || !selectedUserId) {
      toast({
        title: 'Error',
        description: 'Seleccione al menos una variedad y un multiplicador.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await Promise.all(selectedVarietyIds.map(varietyId =>
        grantPermission.mutateAsync({
          varietyId,
          userId: selectedUserId,
          expiresAt: expirationDate ? expirationDate.toISOString() : undefined,
        })
      ));
      
      setSelectedVarietyIds([]);
      setSelectedUserId('');
      setExpirationDate(undefined);
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error granting permissions:", error.message, error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron conceder los permisos.',
        variant: 'destructive',
      });
    }
  };

  const handleRevokePermission = async (permissionId: string) => {
    try {
      await revokePermission.mutateAsync(permissionId);
    } catch (error: any) {
      console.error("Error revoking permission:", error.message, error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo revocar el permiso.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = isLoadingMultipliers || isLoadingCompanyVarieties || isLoadingPermissions;

  const groupPermissionsByMultiplier = (permissions: VarietyPermission[]) => {
    return permissions.reduce((acc, permission) => {
      const userId = permission.userId;
      if (!acc[userId]) {
        acc[userId] = {
          user: permission.user || { name: 'Unknown', email: 'Unknown' },
          permissions: [],
        };
      }
      acc[userId].permissions.push(permission);
      return acc;
    }, {} as Record<string, { user: { name: string; email: string }; permissions: VarietyPermission[] }>);
  };

  const activePermissionsGrouped = groupPermissionsByMultiplier(
    grantedPermissions?.filter(p => !p.expiresAt || new Date(p.expiresAt) > new Date()) || []
  );

  const expiredPermissionsGrouped = groupPermissionsByMultiplier(
    grantedPermissions?.filter(p => p.expiresAt && new Date(p.expiresAt) <= new Date()) || []
  );

  const toggleVarietySelection = (varietyId: string) => {
    setSelectedVarietyIds(prev =>
      prev.includes(varietyId)
        ? prev.filter(id => id !== varietyId)
        : [...prev, varietyId]
    );
  };

  // Safely cast rawMultipliers to the desired type by first casting to unknown
  const multipliersUnknown = (rawMultipliers || []) as unknown;
  const multipliers = (multipliersUnknown as Array<{ id: string; name: string; email: string }>)
    .filter(multiplier => 
      multiplier && 
      typeof multiplier === 'object' && 
      'id' in multiplier && 
      typeof multiplier.id === 'string' && 
      'name' in multiplier && 
      typeof multiplier.name === 'string' && 
      'email' in multiplier && 
      typeof multiplier.email === 'string'
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid gap-6">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <Shield className="h-8 w-8" />
                  Gestión de Permisos
                </h1>
                <p className="text-navy-100 text-lg">
                  Administre qué multiplicadores pueden usar sus variedades
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-white text-navy-600 hover:bg-navy-50 shadow-lg font-semibold"
                  >
                    <Shield className="mr-2 h-4 w-4" /> Conceder Permiso
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/95 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="text-navy-700">Conceder Permiso a Multiplicador</DialogTitle>
                    <DialogDescription>
                      Seleccione variedades y un multiplicador para conceder permisos de uso
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-navy-700">Variedades</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start border-navy-200">
                            {selectedVarietyIds.length > 0
                              ? `${selectedVarietyIds.length} variedades seleccionadas`
                              : 'Seleccione variedades'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white/95 backdrop-blur-sm">
                          <Command>
                            <CommandInput placeholder="Buscar variedades..." />
                            <CommandList>
                              {(companyVarieties || []).map((variety: { id: string; name: string; crop?: { name: string } }) => (
                                <CommandItem
                                  key={variety.id}
                                  value={variety.name}
                                  onSelect={() => toggleVarietySelection(variety.id)}
                                >
                                  <CheckIcon
                                    className={`mr-2 h-4 w-4 ${
                                      selectedVarietyIds.includes(variety.id) ? 'opacity-100' : 'opacity-0'
                                    }`}
                                  />
                                  {variety.name} {variety.crop?.name ? `(${variety.crop.name})` : ''}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-navy-700">Multiplicador</label>
                      <Select 
                        value={selectedUserId} 
                        onValueChange={setSelectedUserId}
                        disabled={isLoadingMultipliers || !multipliers.length}
                      >
                        <SelectTrigger className="border-navy-200">
                          <SelectValue placeholder="Seleccione un multiplicador" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm">
                          {multipliers.map((multiplier) => (
                            <SelectItem key={multiplier.id} value={multiplier.id}>
                              {multiplier.name} ({multiplier.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-navy-700">Fecha de expiración (opcional)</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal border-navy-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expirationDate ? (
                              format(expirationDate, "PPP", { locale: es })
                            ) : (
                              <span>Sin fecha de expiración</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm">
                          <Calendar
                            mode="single"
                            selected={expirationDate}
                            onSelect={setExpirationDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleGrantPermission}
                      disabled={selectedVarietyIds.length === 0 || !selectedUserId || grantPermission.isPending}
                      className="bg-navy-900 hover:bg-navy-800"
                    >
                      Conceder Permiso
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>
        
        {isLoading ? (
          <Card className="navy-card">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
              <span className="text-navy-700">Cargando datos...</span>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="active" className="mb-8">
              <TabsList className="bg-white/80 backdrop-blur-sm border-navy-200 mb-6">
                <TabsTrigger value="active" className="relative data-[state=active]:bg-navy-100 data-[state=active]:text-navy-700">
                  <Users className="h-4 w-4 mr-2" />
                  Activos
                  {Object.keys(activePermissionsGrouped).length > 0 && (
                    <Badge className="ml-2 bg-navy-500 text-white">
                      {Object.keys(activePermissionsGrouped).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="expired" className="relative data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                  <Clock className="h-4 w-4 mr-2" />
                  Expirados
                  {Object.keys(expiredPermissionsGrouped).length > 0 && (
                    <Badge className="ml-2 bg-amber-500 text-white">
                      {Object.keys(expiredPermissionsGrouped).length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                {Object.keys(activePermissionsGrouped).length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-4">
                    {Object.entries(activePermissionsGrouped).map(([userId, group]) => (
                      <AccordionItem key={userId} value={userId}>
                        <Card className="navy-card">
                          <AccordionTrigger className="hover:no-underline px-6 py-4">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center">
                                <div className="bg-navy-100 p-2 rounded-full mr-3">
                                  <UserCheck className="h-5 w-5 text-navy-600" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold text-navy-700">
                                    {group.user.name}
                                  </h3>
                                  <p className="text-sm text-navy-600">{group.user.email}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="ml-2 text-navy-700 border-navy-200">
                                {group.permissions.length} Variedad{group.permissions.length !== 1 ? 'es' : ''}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 px-6 pb-4">
                              {group.permissions.map(permission => (
                                <div
                                  key={permission.id}
                                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-navy-50 p-4 rounded-lg border border-navy-100"
                                >
                                  <div className="flex items-center gap-3">
                                    <Sprout className="h-5 w-5 text-navy-600" />
                                    <div>
                                      <p className="font-medium text-navy-800">
                                        {permission.variety?.name} {permission.variety?.crop?.name ? `(${permission.variety.crop.name})` : ''}
                                      </p>
                                      <div className="flex items-center text-xs text-navy-600 mt-1">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Concedido el {new Date(permission.grantedAt).toLocaleDateString()}
                                        {permission.expiresAt && (
                                          <> · Expira el {new Date(permission.expiresAt).toLocaleDateString()}</>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-3 md:mt-0">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                      onClick={() => handleRevokePermission(permission.id)}
                                    >
                                      <XIcon className="mr-1 h-3 w-3" />
                                      Revocar
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Card className="navy-card">
                    <CardContent className="p-12 text-center">
                      <div className="mx-auto bg-navy-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Shield className="h-8 w-8 text-navy-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay permisos activos</h3>
                      <p className="text-gray-600 mb-6">Comience concediendo permisos a multiplicadores para usar sus variedades.</p>
                      <Button 
                        onClick={() => setDialogOpen(true)}
                        className="bg-navy-900 hover:bg-navy-800"
                      >
                        <Shield className="mr-2 h-4 w-4" /> Conceder Primer Permiso
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="expired" className="space-y-4">
                {Object.keys(expiredPermissionsGrouped).length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-4">
                    {Object.entries(expiredPermissionsGrouped).map(([userId, group]) => (
                      <AccordionItem key={userId} value={userId}>
                        <Card className="navy-card opacity-75">
                          <AccordionTrigger className="hover:no-underline px-6 py-4">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center">
                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                  <XIcon className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold text-amber-700">
                                    {group.user.name}
                                  </h3>
                                  <p className="text-sm text-amber-600">{group.user.email}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="ml-2 text-amber-700 border-amber-200">
                                {group.permissions.length} Variedad{group.permissions.length !== 1 ? 'es' : ''}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 px-6 pb-4">
                              {group.permissions.map(permission => (
                                <div
                                  key={permission.id}
                                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-amber-50 p-4 rounded-lg border border-amber-100"
                                >
                                  <div className="flex items-center gap-3">
                                    <Sprout className="h-5 w-5 text-amber-600" />
                                    <div>
                                      <p className="font-medium text-amber-800">
                                        {permission.variety?.name} {permission.variety?.crop?.name ? `(${permission.variety.crop.name})` : ''}
                                      </p>
                                      <div className="flex items-center text-xs text-amber-600 mt-1">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Concedido el {new Date(permission.grantedAt).toLocaleDateString()} · 
                                        Expirado el {new Date(permission.expiresAt!).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-3 md:mt-0 flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleRevokePermission(permission.id)}
                                      className="border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                      <XIcon className="mr-1 h-3 w-3" />
                                      Eliminar
                                    </Button>
                                    <Button 
                                      size="sm"
                                      className="bg-navy-900 hover:bg-navy-800"
                                      onClick={() => {
                                        setSelectedVarietyIds([permission.varietyId]);
                                        setSelectedUserId(permission.userId);
                                        setDialogOpen(true);
                                      }}
                                    >
                                      <CheckIcon className="mr-1 h-3 w-3" />
                                      Renovar
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Card className="navy-card">
                    <CardContent className="p-12 text-center">
                      <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Clock className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay permisos expirados</h3>
                      <p className="text-gray-600">Todos los permisos activos están vigentes.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default GeneticsCompanyPermissionsPage;
