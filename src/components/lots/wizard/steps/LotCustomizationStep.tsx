
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Hash, Scale, Lock } from 'lucide-react';
import { WizardData } from '../hooks/useWizardState';
import { useUnits } from '@/hooks/useUnits';
import { useLotTypes } from '@/hooks/useLotTypes';

interface LotCustomizationStepProps {
  wizardData: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

export const LotCustomizationStep: React.FC<LotCustomizationStepProps> = ({
  wizardData,
  onUpdate
}) => {
  const originLot = wizardData.originLot;
  const { data: units = [] } = useUnits();
  const { data: lotTypes = [] } = useLotTypes();

  // Filter units based on lot type permissions
  const availableUnits = units.filter(unit => {
    // For now, show all units. In the future, we'd filter based on lot_type_unit_permissions
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-navy-900 mb-2">
          Personalizar Nuevo Lote
        </h2>
        <p className="text-navy-600">
          Los datos principales se heredarán del lote de origen. Complete los campos únicos del nuevo lote.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inherited Data - Now truly locked */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Datos Heredados
              <Badge variant="secondary">Bloqueado</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-green-800">Lote de Origen:</span>
                <span className="text-sm font-bold text-green-900">{originLot?.code}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Variedad:</span>
                  <span className="font-medium text-green-900">{originLot?.variety?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Categoría:</span>
                  <span className="font-medium text-green-900">{originLot?.category?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Planta:</span>
                  <span className="font-medium text-green-900">{originLot?.plant?.name}</span>
                </div>
                {originLot?.campaign && (
                  <div className="flex justify-between">
                    <span className="text-green-700">Campaña:</span>
                    <span className="font-medium text-green-900">{originLot.campaign.name}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    Estos datos están bloqueados y no pueden modificarse
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Data Required */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-blue-600" />
              Datos Nuevos
              <Badge variant="destructive">Requerido</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">Código del Nuevo Lote *</Label>
              <Input
                id="code"
                placeholder="Ej: LOT-2024-001"
                value={wizardData.code || ''}
                onChange={(e) => onUpdate({ code: e.target.value })}
                className="border-blue-300 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Debe ser único y diferente al lote de origen ({originLot?.code})
              </p>
            </div>

            <div>
              <Label htmlFor="amount">Cantidad *</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={wizardData.amount || ''}
                    onChange={(e) => onUpdate({ amount: parseFloat(e.target.value) || 0 })}
                    className="pl-10 border-blue-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cantidad específica para este nuevo lote
              </p>
            </div>

            <div>
              <Label htmlFor="unit">Unidad *</Label>
              <Select 
                value={wizardData.unitId || ''} 
                onValueChange={(value) => onUpdate({ unitId: value })}
              >
                <SelectTrigger className="border-blue-300 focus:border-blue-500">
                  <SelectValue placeholder="Seleccione la unidad apropiada para este tipo de lote" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Importante:</strong> La unidad NO se hereda del lote origen. Debe seleccionar la unidad apropiada para el nuevo tipo de lote.
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                placeholder="Observaciones específicas para este lote..."
                value={wizardData.notes || ''}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                className="min-h-[80px] border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional: información adicional sobre este lote específico
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Inheritance Warning */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Herencia Bloqueada</h4>
              <p className="text-sm text-amber-700">
                El nuevo lote heredará automáticamente e inmutablemente la variedad, categoría, planta y campaña 
                del lote <strong>{originLot?.code}</strong>. Estos campos están bloqueados para mantener la integridad 
                de la herencia. Solo puede especificar el código único, la cantidad, la unidad apropiada para el nuevo tipo de lote, y notas adicionales.
              </p>
              <p className="text-sm text-amber-700 mt-2">
                <strong>Nota importante:</strong> La unidad NO se hereda y debe seleccionarse según las reglas del nuevo tipo de lote.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
