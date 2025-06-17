
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
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';
import { LotFormData } from './types';

interface BasicInfoSectionProps {
  form: UseFormReturn<LotFormData>;
  multiplierVarieties: any[];
  isLoadingMultiplierVarieties: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  multiplierVarieties,
  isLoadingMultiplierVarieties,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Información Básica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Lote *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: LOT-2025-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="varietyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variedad *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoadingMultiplierVarieties}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una variedad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {multiplierVarieties?.map((variety) => (
                      <SelectItem key={variety.id} value={variety.id}>
                        {variety.name} {variety.crop?.name ? `(${variety.crop.name})` : ''}
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

export default BasicInfoSection;
