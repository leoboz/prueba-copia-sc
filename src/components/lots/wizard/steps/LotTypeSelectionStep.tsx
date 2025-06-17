
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLotTypes } from '@/hooks/useLotTypes';
import { getLotTypeName, getOriginRequirement } from '@/utils/lotTypeUtils';
import { Package, Truck, Cog, ShoppingBag } from 'lucide-react';

interface LotTypeSelectionStepProps {
  selectedLotTypeId?: string;
  onSelect: (lotTypeId: string) => void;
}

export const LotTypeSelectionStep: React.FC<LotTypeSelectionStepProps> = ({
  selectedLotTypeId,
  onSelect
}) => {
  const { data: lotTypes = [], isLoading } = useLotTypes();

  const getIcon = (typeName: string | null) => {
    switch (typeName) {
      case 'SILOBOLSA': return Package;
      case 'INGRESO': return Truck;
      case 'PROCESO INTERMEDIO': return Cog;
      case 'EMBOLSE FINAL': return ShoppingBag;
      default: return Package;
    }
  };

  const getDescription = (typeName: string | null) => {
    switch (typeName) {
      case 'SILOBOLSA':
        return 'Lote inicial de almacenamiento sin origen específico';
      case 'INGRESO':
        return 'Lote de ingreso que puede originarse de otros lotes';
      case 'PROCESO INTERMEDIO':
        return 'Lote en proceso que debe originarse de lotes existentes';
      case 'EMBOLSE FINAL':
        return 'Lote final empaquetado que hereda de lotes anteriores';
      default:
        return 'Tipo de lote';
    }
  };

  const getOriginBadge = (typeName: string | null) => {
    if (!typeName) return <Badge variant="default">Sin Origen</Badge>;
    
    const originReq = getOriginRequirement(typeName as any);
    if (originReq.required) {
      return <Badge variant="destructive">Origen Requerido</Badge>;
    } else if (originReq.allowText || originReq.allowReference) {
      return <Badge variant="secondary">Origen Opcional</Badge>;
    } else {
      return <Badge variant="default">Sin Origen</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-navy-900 mb-2">
          ¿Qué tipo de lote desea crear?
        </h2>
        <p className="text-navy-600">
          Seleccione el tipo de lote para continuar con el proceso de creación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lotTypes.map((lotType) => {
          const typeName = getLotTypeName(lotTypes, lotType.id);
          const Icon = getIcon(typeName);
          const isSelected = selectedLotTypeId === lotType.id;

          return (
            <Card
              key={lotType.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                isSelected
                  ? 'ring-2 ring-countryside-green bg-countryside-green/5'
                  : 'hover:bg-navy-50/50'
              }`}
              onClick={() => onSelect(lotType.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected 
                      ? 'bg-countryside-green text-white' 
                      : 'bg-navy-100 text-navy-600'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-navy-900">
                        {typeName || lotType.name}
                      </h3>
                      {getOriginBadge(typeName)}
                    </div>
                    
                    <p className="text-navy-600 text-sm">
                      {getDescription(typeName)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
