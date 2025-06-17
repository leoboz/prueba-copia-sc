
import { z } from 'zod';

export const formSchema = z.object({
  code: z.string().min(3, { message: 'El código debe tener al menos 3 caracteres' }),
  varietyId: z.string().min(1, { message: 'Debe seleccionar una variedad' }),
  categoryId: z.string().min(1, { message: 'Debe seleccionar una categoría' }),
  plantId: z.string().min(1, { message: 'Debe seleccionar una planta' }),
  campaignId: z.string().optional(),
  lotTypeId: z.string().min(1, { message: 'Debe seleccionar un tipo de lote' }),
  unitId: z.string().min(1, { message: 'Debe seleccionar una unidad' }),
  originType: z.enum(['none', 'reference', 'text'], { 
    required_error: 'Debe seleccionar el tipo de origen' 
  }),
  originLotId: z.string().optional(),
  originText: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    // Basic validation: if originType is reference, we need originLotId
    if (data.originType === 'reference') {
      return data.originLotId && data.originLotId.length > 0;
    }
    
    // Basic validation: if originType is text, we need originText
    if (data.originType === 'text') {
      return data.originText && data.originText.length > 0;
    }
    
    return true;
  },
  {
    message: 'Debe especificar el origen del lote según el tipo seleccionado',
    path: ['originLotId'],
  }
);

export type LotFormData = z.infer<typeof formSchema>;

// Enhanced validation function to be used in the component
export const validateLotFormData = (
  data: LotFormData, 
  lotTypes: any[], 
  getLotTypeNameFn: (lotTypes: any[], lotTypeId: string) => string | null,
  getOriginRequirementFn: (lotTypeName: string | null) => { required: boolean; allowText: boolean; allowReference: boolean }
) => {
  const lotTypeName = getLotTypeNameFn(lotTypes, data.lotTypeId);
  const originReq = getOriginRequirementFn(lotTypeName);
  
  // If origin is required but not provided
  if (originReq.required && data.originType === 'none') {
    return { success: false, error: `Los lotes tipo ${lotTypeName} requieren especificar un origen` };
  }
  
  // If origin type is not allowed for this lot type
  if (data.originType === 'text' && !originReq.allowText) {
    return { success: false, error: `Los lotes tipo ${lotTypeName} no permiten origen de texto libre` };
  }
  
  if (data.originType === 'reference' && !originReq.allowReference) {
    return { success: false, error: `Los lotes tipo ${lotTypeName} no permiten referencia a otros lotes` };
  }
  
  return { success: true };
};
