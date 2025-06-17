
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Package, ArrowRight, Lock } from 'lucide-react';
import { WizardData } from '../hooks/useWizardState';
import { useCreateLot } from '@/hooks/lots/lotMutations';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LotReviewStepProps {
  wizardData: WizardData;
  onComplete: () => void;
}

export const LotReviewStep: React.FC<LotReviewStepProps> = ({
  wizardData,
  onComplete
}) => {
  const { user } = useAuth();
  const createLot = useCreateLot();

  const handleCreate = async () => {
    if (!user) return;

    try {
      console.log('🎯 Creating lot with wizard data:', wizardData);

      // BULLETPROOF: Force use origin lot data if we have it (simplified logic)
      let varietyId, categoryId, plantId, campaignId;
      
      if (wizardData.originLot) {
        console.log('🔒 USING origin lot data for inheritance:', wizardData.originLot.code);
        varietyId = wizardData.originLot.varietyId!;
        categoryId = wizardData.originLot.categoryId!;
        plantId = wizardData.originLot.plantId!;
        campaignId = wizardData.originLot.campaignId;
      } else {
        console.log('📝 Using manually entered data');
        varietyId = wizardData.varietyId!;
        categoryId = wizardData.categoryId!;
        plantId = wizardData.plantId!;
        campaignId = wizardData.campaignId;
      }

      const lotData = {
        code: wizardData.code!,
        varietyId,
        categoryId,
        plantId,
        campaignId,
        unitId: wizardData.unitId!, // Unit is NEVER inherited
        lotTypeId: wizardData.lotTypeId!,
        userId: user.id,
        status: 'retenido' as const,
        originLotId: wizardData.originLotId,
        amount: wizardData.amount!,
      };

      console.log('🚀 Final lot data being sent:', lotData);

      await createLot.mutateAsync(lotData);
      toast({
        title: 'Lote creado exitosamente',
        description: `El lote ${wizardData.code} ha sido creado correctamente.`,
      });
      onComplete();
    } catch (error) {
      console.error('❌ Error creating lot:', error);
      toast({
        title: 'Error al crear lote',
        description: 'Hubo un problema al crear el lote. Intente nuevamente.',
        variant: 'destructive',
      });
    }
  };

  // SIMPLIFIED: Get display data based on origin lot presence
  const getDisplayData = () => {
    if (wizardData.originLot) {
      return {
        variety: wizardData.originLot.variety?.name || 'N/A',
        category: wizardData.originLot.category?.name || 'N/A',
        plant: wizardData.originLot.plant?.name || 'N/A',
        campaign: wizardData.originLot.campaign?.name || 'Sin campaña',
        isInherited: true,
      };
    }
    
    return {
      variety: 'Selección manual',
      category: 'Selección manual',
      plant: 'Selección manual',
      campaign: 'Selección manual',
      isInherited: false,
    };
  };

  const displayData = getDisplayData();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-navy-900 mb-2">
          Revisar y Crear Lote
        </h2>
        <p className="text-navy-600">
          Verifique la información antes de crear el lote
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lot Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Información del Lote
              {displayData.isInherited && (
                <Badge variant="secondary" className="ml-2">
                  <Lock className="h-3 w-3 mr-1" />
                  Heredado
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-navy-700">Código:</span>
                <span className="font-bold text-navy-900">{wizardData.code}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-navy-700">Cantidad:</span>
                <span className="font-bold text-navy-900">
                  {wizardData.amount} unidades
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-navy-700">Unidad:</span>
                <div className="flex items-center gap-2">
                  <span className="text-navy-900">Nueva selección</span>
                  <Badge variant="outline">No heredado</Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-navy-700">Variedad:</span>
                <div className="flex items-center gap-2">
                  <span className="text-navy-900">{displayData.variety}</span>
                  {displayData.isInherited && <Lock className="h-3 w-3 text-green-600" />}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-navy-700">Categoría:</span>
                <div className="flex items-center gap-2">
                  <span className="text-navy-900">{displayData.category}</span>
                  {displayData.isInherited && <Lock className="h-3 w-3 text-green-600" />}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-navy-700">Planta:</span>
                <div className="flex items-center gap-2">
                  <span className="text-navy-900">{displayData.plant}</span>
                  {displayData.isInherited && <Lock className="h-3 w-3 text-green-600" />}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-navy-700">Campaña:</span>
                <div className="flex items-center gap-2">
                  <span className="text-navy-900">{displayData.campaign}</span>
                  {displayData.isInherited && <Lock className="h-3 w-3 text-green-600" />}
                </div>
              </div>
            </div>

            {wizardData.notes && (
              <div className="border-t pt-3">
                <span className="font-medium text-navy-700">Notas:</span>
                <p className="text-sm text-navy-600 mt-1">{wizardData.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Origin Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Información de Origen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wizardData.originLot ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">
                    <Lock className="h-3 w-3 mr-1" />
                    Heredado
                  </Badge>
                  <span className="text-sm text-navy-600">
                    Datos heredados del lote de origen
                  </span>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-green-800">Lote de Origen:</span>
                    <span className="font-bold text-green-900">{wizardData.originLot.code}</span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    Los datos principales se heredaron automáticamente de este lote.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2">
                    <div className="flex items-center gap-1 text-xs text-amber-700">
                      <span className="font-medium">Nota:</span>
                      <span>La unidad NO se hereda - debe seleccionarse según el tipo de lote nuevo</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default">Nuevo</Badge>
                  <span className="text-sm text-navy-600">
                    Lote creado desde cero
                  </span>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    Este lote se creó completamente nuevo sin heredar datos de otros lotes.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Button */}
      <Card className="bg-gradient-to-r from-countryside-green to-countryside-green-dark">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="text-xl font-semibold mb-1">¿Todo correcto?</h3>
              <p className="text-countryside-green-light">
                {displayData.isInherited 
                  ? `El lote heredará datos de ${wizardData.originLot?.code} (excepto la unidad)`
                  : 'Una vez creado, el lote estará disponible para generar muestras y análisis.'
                }
              </p>
            </div>
            
            <Button
              size="lg"
              onClick={handleCreate}
              disabled={createLot.isPending}
              className="bg-white text-countryside-green hover:bg-gray-100 font-semibold"
            >
              {createLot.isPending ? (
                <>Creando...</>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Crear Lote
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
