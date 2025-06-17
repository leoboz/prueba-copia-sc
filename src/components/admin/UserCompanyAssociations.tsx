
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Building, AlertCircle, Loader2 } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useUserCompanyAssociations } from '@/hooks/useUserCompanyAssociations';
import { AdminUser } from '@/hooks/useAdminUsers';

interface UserCompanyAssociationsProps {
  user: AdminUser;
}

const roleLabels = {
  geneticsCompany: 'Empresa Genética',
  multiplier: 'Multiplicador',
  lab: 'Laboratorio',
  farmer: 'Productor'
};

const UserCompanyAssociations: React.FC<UserCompanyAssociationsProps> = ({ user }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  
  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();
  const { 
    userAssociations, 
    isLoading: isLoadingAssociations, 
    addAssociation, 
    removeAssociation 
  } = useUserCompanyAssociations(user.id);

  const handleAddAssociation = async () => {
    if (!selectedCompanyId) return;
    
    // Find the selected company to get its role
    const selectedCompany = companies?.find(c => c.id === selectedCompanyId);
    if (!selectedCompany) return;
    
    try {
      await addAssociation.mutateAsync({
        userId: user.id,
        companyId: selectedCompanyId,
        role: selectedCompany.role // Use the company's role
      });
      setSelectedCompanyId('');
    } catch (error) {
      console.error('Error adding association:', error);
    }
  };

  const handleRemoveAssociation = async (associationId: string) => {
    try {
      await removeAssociation.mutateAsync(associationId);
    } catch (error) {
      console.error('Error removing association:', error);
    }
  };

  const availableCompanies = companies?.filter(company => 
    !userAssociations?.some(assoc => assoc.companyId === company.id)
  ) || [];

  const selectedCompany = companies?.find(c => c.id === selectedCompanyId);

  if (isLoadingCompanies || isLoadingAssociations) {
    return (
      <Card className="navy-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-navy-600 mr-2" />
            <span className="text-navy-700">Cargando asociaciones...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="navy-card">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-navy-900 flex items-center">
            <Building className="mr-3 h-5 w-5 text-navy-600" />
            Empresas Asociadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Associations */}
          <div className="space-y-3">
            {userAssociations && userAssociations.length > 0 ? (
              userAssociations.map((association) => (
                <div 
                  key={association.id}
                  className="flex items-center justify-between p-3 bg-navy-50 rounded-lg border border-navy-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-navy-100 rounded-md">
                      <Building className="h-4 w-4 text-navy-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-800">{association.company?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {roleLabels[association.role as keyof typeof roleLabels] || association.role}
                        </Badge>
                        <span className="text-xs text-navy-500">
                          {association.company?.code}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAssociation(association.id)}
                    disabled={removeAssociation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {removeAssociation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="mx-auto h-8 w-8 text-navy-300 mb-2" />
                <p className="text-navy-600">Este usuario no tiene empresas asociadas</p>
              </div>
            )}
          </div>

          {/* Add New Association */}
          <div className="border-t border-navy-200 pt-6">
            <h4 className="font-medium text-navy-900 mb-4">Agregar Nueva Asociación</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-navy-700 mb-2 block">
                  Empresa
                </label>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger className="border-navy-200">
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCompanies && availableCompanies.length > 0 ? (
                      availableCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center gap-2">
                            <span>{company.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {company.code}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {roleLabels[company.role as keyof typeof roleLabels]}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-companies-available" disabled>
                        No hay empresas disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Show selected company role info */}
              {selectedCompany && (
                <div className="p-3 bg-navy-50 rounded-lg border border-navy-200">
                  <p className="text-sm text-navy-700">
                    <strong>Rol asignado:</strong> {roleLabels[selectedCompany.role as keyof typeof roleLabels]}
                  </p>
                  <p className="text-xs text-navy-500 mt-1">
                    El rol se asigna automáticamente según el tipo de empresa seleccionada.
                  </p>
                </div>
              )}

              <Button
                onClick={handleAddAssociation}
                disabled={!selectedCompanyId || addAssociation.isPending || selectedCompanyId === 'no-companies-available'}
                className="bg-navy-600 hover:bg-navy-700 w-full"
              >
                {addAssociation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Asociación
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCompanyAssociations;
