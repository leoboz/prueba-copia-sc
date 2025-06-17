
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlants, useCreatePlant } from '@/hooks/usePlants';
import { CreatePlantModal } from './CreatePlantModal';
import StandardPageHeader from '@/components/common/StandardPageHeader';
import { Building2, Plus, CheckCircle, Clock, Factory } from 'lucide-react';

const MultiplierPlantsView: React.FC = () => {
  const { data: plants, isLoading } = usePlants();
  const createPlantMutation = useCreatePlant();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreatePlant = async (plantData: { name: string }) => {
    try {
      await createPlantMutation.mutateAsync(plantData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating plant:', error);
    }
  };

  const myPlants = plants?.filter(plant => plant.multiplierId) || [];
  const verifiedCount = myPlants.filter(plant => plant.isVerified).length;
  const pendingCount = myPlants.filter(plant => !plant.isVerified).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StandardPageHeader
          title="Gestión de Plantas"
          subtitle="Administre sus plantas de producción y monitoree su estado de verificación"
          icon={Factory}
          backgroundGradient="from-indigo-600 via-indigo-700 to-indigo-800"
        >
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Planta
          </Button>
        </StandardPageHeader>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-800">Total de Plantas</CardTitle>
              <Factory className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-900">{myPlants.length}</div>
              <p className="text-xs text-indigo-600 mt-1">plantas registradas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Plantas Verificadas</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{verifiedCount}</div>
              <p className="text-xs text-green-600 mt-1">listas para operar</p>
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
        </div>

        {/* Plants List */}
        <Card className="border-navy-200/40 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-navy-900 flex items-center">
              <Factory className="h-6 w-6 mr-3 text-indigo-700" />
              Mis Plantas de Producción
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
              </div>
            ) : myPlants.length === 0 ? (
              <div className="text-center py-12">
                <Factory className="h-16 w-16 text-navy-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-navy-700 mb-2">No hay plantas registradas</h3>
                <p className="text-navy-500 mb-6">Registre su primera planta de producción para comenzar</p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primera Planta
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPlants.map((plant) => (
                  <Card key={plant.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-navy-900 flex items-center">
                          <Factory className="h-4 w-4 mr-2 text-indigo-600" />
                          {plant.name}
                        </h3>
                        <Badge 
                          variant={plant.isVerified ? "default" : "secondary"}
                          className={plant.isVerified ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                        >
                          {plant.isVerified ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verificada
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="text-sm text-navy-600">
                        <p>Creada: {new Date(plant.createdAt).toLocaleDateString()}</p>
                        {plant.updatedAt !== plant.createdAt && (
                          <p>Actualizada: {new Date(plant.updatedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                      {!plant.isVerified && (
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-700">
                            Esta planta está pendiente de verificación por parte de la empresa genética.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <CreatePlantModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreatePlant}
          isLoading={createPlantMutation.isPending}
        />
      </div>
    </div>
  );
};

export default MultiplierPlantsView;
