
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlants, useUpdatePlant } from '@/hooks/usePlants';
import { PlantVerificationTable } from './PlantVerificationTable';
import StandardPageHeader from '@/components/common/StandardPageHeader';
import { Factory, CheckCircle, Clock, Building2, Users } from 'lucide-react';

const GeneticsCompanyPlantsView: React.FC = () => {
  const { data: plants, isLoading } = usePlants();
  const updatePlantMutation = useUpdatePlant();

  const handleVerifyPlant = async (plantId: string, isVerified: boolean) => {
    try {
      await updatePlantMutation.mutateAsync({ id: plantId, isVerified });
    } catch (error) {
      console.error('Error updating plant verification:', error);
    }
  };

  const allPlants = plants || [];
  const verifiedCount = allPlants.filter(plant => plant.isVerified).length;
  const pendingCount = allPlants.filter(plant => !plant.isVerified).length;
  const totalMultipliers = new Set(allPlants.map(plant => plant.multiplierId)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StandardPageHeader
          title="Verificación de Plantas"
          subtitle="Supervise y verifique las plantas de producción registradas por multiplicadores"
          icon={Factory}
          backgroundGradient="from-navy-900 via-navy-800 to-navy-900"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-navy-50 to-navy-100 border-navy-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-800">Total de Plantas</CardTitle>
              <Factory className="h-5 w-5 text-navy-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-navy-900">{allPlants.length}</div>
              <p className="text-xs text-navy-600 mt-1">plantas registradas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Verificadas</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{verifiedCount}</div>
              <p className="text-xs text-green-600 mt-1">plantas aprobadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Pendientes</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{pendingCount}</div>
              <p className="text-xs text-orange-600 mt-1">esperando verificación</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Multiplicadores</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalMultipliers}</div>
              <p className="text-xs text-blue-600 mt-1">multiplicadores activos</p>
            </CardContent>
          </Card>
        </div>

        {/* Plants Verification Table */}
        <Card className="border-navy-200/40 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-navy-900 flex items-center">
              <Factory className="h-6 w-6 mr-3 text-navy-700" />
              Verificación de Plantas de Producción
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
              </div>
            ) : allPlants.length === 0 ? (
              <div className="text-center py-12">
                <Factory className="h-16 w-16 text-navy-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-navy-700 mb-2">No hay plantas registradas</h3>
                <p className="text-navy-500">Aún no hay plantas de producción registradas por multiplicadores</p>
              </div>
            ) : (
              <PlantVerificationTable
                plants={allPlants}
                onVerifyPlant={handleVerifyPlant}
                isUpdating={updatePlantMutation.isPending}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneticsCompanyPlantsView;
