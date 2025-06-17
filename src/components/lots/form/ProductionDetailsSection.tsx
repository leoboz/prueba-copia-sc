
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building } from 'lucide-react';
import { LotFormData } from './types';

interface ProductionDetailsSectionProps {
  form: UseFormReturn<LotFormData>;
  userPlants: any[];
  campaigns: any[];
  availableUnits: any[];
  watchedLotType: string;
  isLoadingPlants: boolean;
  isLoadingCampaigns: boolean;
  isLoadingUnits: boolean;
}

const ProductionDetailsSection: React.FC<ProductionDetailsSectionProps> = ({
  form,
  userPlants,
  campaigns,
  availableUnits,
  watchedLotType,
  isLoadingPlants,
  isLoadingCampaigns,
  isLoadingUnits,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Detalles de Producción
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="plantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Planta *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoadingPlants}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una planta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userPlants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name}
                        {plant.isVerified && ' ✓'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="campaignId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaña</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    // Handle the special "none" case by setting undefined
                    field.onChange(value === "none" ? undefined : value);
                  }} 
                  defaultValue={field.value || "none"}
                  disabled={isLoadingCampaigns}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una campaña" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Sin campaña específica</SelectItem>
                    {campaigns?.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoadingUnits || !watchedLotType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !watchedLotType 
                          ? "Primero seleccione tipo de lote" 
                          : "Seleccione una unidad"
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionDetailsSection;
