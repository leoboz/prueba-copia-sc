
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Hash, Scale } from 'lucide-react';
import { WizardData } from '../hooks/useWizardState';
import { useVarieties } from '@/hooks/useVarieties';
import { useCategories } from '@/hooks/useCategories';
import { usePlants } from '@/hooks/usePlants';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useUnits } from '@/hooks/useUnits';

interface NewLotDetailsStepProps {
  wizardData: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

export const NewLotDetailsStep: React.FC<NewLotDetailsStepProps> = ({
  wizardData,
  onUpdate
}) => {
  const { data: varieties = [] } = useVarieties();
  const { data: categories = [] } = useCategories();
  const { data: plants = [] } = usePlants();
  const { data: campaigns = [] } = useCampaigns();
  const { data: units = [] } = useUnits();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-navy-900 mb-2">
          Detalles del Lote
        </h2>
        <p className="text-navy-600">
          Complete la información necesaria para crear el nuevo lote
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">Código del Lote *</Label>
              <Input
                id="code"
                placeholder="Ej: LOT-2024-001"
                value={wizardData.code || ''}
                onChange={(e) => onUpdate({ code: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="amount">Cantidad *</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={wizardData.amount || ''}
                  onChange={(e) => onUpdate({ amount: parseFloat(e.target.value) || 0 })}
                  className="flex-1"
                />
                <div className="w-24">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={wizardData.unitId || ''}
                    onChange={(e) => onUpdate({ unitId: e.target.value })}
                  >
                    <option value="">Unidad</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="variety">Variedad *</Label>
              <select
                id="variety"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={wizardData.varietyId || ''}
                onChange={(e) => onUpdate({ varietyId: e.target.value })}
              >
                <option value="">Seleccione una variedad</option>
                {varieties.map(variety => (
                  <option key={variety.id} value={variety.id}>
                    {variety.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={wizardData.categoryId || ''}
                onChange={(e) => onUpdate({ categoryId: e.target.value })}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Production Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalles de Producción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="plant">Planta *</Label>
              <select
                id="plant"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={wizardData.plantId || ''}
                onChange={(e) => onUpdate({ plantId: e.target.value })}
              >
                <option value="">Seleccione una planta</option>
                {plants.map(plant => (
                  <option key={plant.id} value={plant.id}>
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="campaign">Campaña</Label>
              <select
                id="campaign"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={wizardData.campaignId || ''}
                onChange={(e) => onUpdate({ campaignId: e.target.value })}
              >
                <option value="">Sin campaña específica</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Observaciones o notas adicionales..."
                value={wizardData.notes || ''}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
