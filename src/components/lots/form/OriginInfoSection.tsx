
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Info } from 'lucide-react';
import { LotFormData } from './types';
import { LotType } from '@/types/master-data';
import { getLotTypeName, getOriginRequirement } from '@/utils/lotTypeUtils';
import { useParentLots } from '@/hooks/useParentLots';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OriginInfoSectionProps {
  form: UseFormReturn<LotFormData>;
  watchedOriginType: string;
  watchedLotType: string;
  watchedVariety: string;
  watchedCategory: string;
  watchedPlant: string;
  watchedCampaign?: string;
  lotTypes: LotType[];
}

const OriginInfoSection: React.FC<OriginInfoSectionProps> = ({
  form,
  watchedOriginType,
  watchedLotType,
  watchedVariety,
  watchedCategory,
  watchedPlant,
  watchedCampaign,
  lotTypes,
}) => {
  const lotTypeName = getLotTypeName(lotTypes, watchedLotType);
  const originReq = getOriginRequirement(lotTypeName);

  // Fetch compatible parent lots
  const { data: parentLots = [], isLoading: isLoadingParentLots } = useParentLots({
    varietyId: watchedVariety,
    categoryId: watchedCategory,
    plantId: watchedPlant,
    campaignId: watchedCampaign,
    currentLotTypeName: lotTypeName,
    lotTypes,
  });

  // For SILOBOLSA, only show if user wants to add optional origin
  const showOriginSection = lotTypeName !== 'SILOBOLSA' || watchedOriginType !== 'none';

  // Reset origin type when lot type changes to enforce business rules
  React.useEffect(() => {
    if (lotTypeName === 'SILOBOLSA') {
      form.setValue('originType', 'none');
    } else if (lotTypeName === 'PROCESO INTERMEDIO' || lotTypeName === 'EMBOLSE FINAL') {
      if (watchedOriginType === 'none' || watchedOriginType === 'text') {
        form.setValue('originType', 'reference');
      }
    }
  }, [lotTypeName, form, watchedOriginType]);

  // Clear origin fields when origin type changes
  React.useEffect(() => {
    if (watchedOriginType === 'none') {
      form.setValue('originLotId', '');
      form.setValue('originText', '');
    } else if (watchedOriginType === 'reference') {
      form.setValue('originText', '');
    } else if (watchedOriginType === 'text') {
      form.setValue('originLotId', '');
    }
  }, [watchedOriginType, form]);

  const getOriginHelpText = () => {
    if (!lotTypeName) return '';
    
    switch (lotTypeName) {
      case 'SILOBOLSA':
        return 'Los lotes SILOBOLSA pueden tener origen opcional para documentar la fuente externa.';
      case 'INGRESO':
        return 'Los lotes INGRESO pueden originarse de lotes SILOBOLSA o fuentes externas.';
      case 'PROCESO INTERMEDIO':
        return 'Los lotes PROCESO INTERMEDIO deben originarse de lotes SILOBOLSA o INGRESO.';
      case 'EMBOLSE FINAL':
        return 'Los lotes EMBOLSE FINAL deben originarse de lotes SILOBOLSA, INGRESO o PROCESO INTERMEDIO.';
      default:
        return '';
    }
  };

  const getOriginTypeOptions = () => {
    const options = [];
    
    if (!originReq.required) {
      options.push({ value: 'none', label: 'Sin origen específico' });
    }
    
    if (originReq.allowText) {
      options.push({ value: 'text', label: 'Descripción libre' });
    }
    
    if (originReq.allowReference) {
      options.push({ value: 'reference', label: 'Lote de origen' });
    }
    
    return options;
  };

  if (lotTypeName === 'SILOBOLSA' && watchedOriginType === 'none') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información de Origen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {getOriginHelpText()} 
              <button
                type="button"
                onClick={() => form.setValue('originType', 'text')}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Agregar información de origen
              </button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const originTypeOptions = getOriginTypeOptions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Información de Origen
          {originReq.required && <span className="text-red-500">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {getOriginHelpText() && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{getOriginHelpText()}</AlertDescription>
          </Alert>
        )}

        {originTypeOptions.length > 1 && (
          <FormField
            control={form.control}
            name="originType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Tipo de Origen {originReq.required && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {originTypeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchedOriginType === 'text' && (
          <FormField
            control={form.control}
            name="originText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descripción del Origen <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describa el origen de este lote..." 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchedOriginType === 'reference' && (
          <FormField
            control={form.control}
            name="originLotId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Lote de Origen <span className="text-red-500">*</span>
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isLoadingParentLots}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        isLoadingParentLots 
                          ? "Cargando lotes compatibles..." 
                          : parentLots.length === 0
                            ? "No hay lotes compatibles disponibles"
                            : "Seleccione un lote de origen"
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {parentLots.map((lot) => {
                      const parentLotTypeName = getLotTypeName(lotTypes, lot.lotTypeId || '');
                      return (
                        <SelectItem key={lot.id} value={lot.id}>
                          {lot.code} ({parentLotTypeName})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {parentLots.length === 0 && !isLoadingParentLots && watchedVariety && watchedCategory && watchedPlant && (
                  <p className="text-sm text-muted-foreground">
                    No se encontraron lotes compatibles. Verifique que existan lotes del tipo requerido con la misma variedad, categoría y planta.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OriginInfoSection;
