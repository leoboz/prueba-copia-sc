
import { LotType } from '@/types/master-data';

export const LOT_TYPE_NAMES = {
  SILOBOLSA: 'SILOBOLSA',
  INGRESO: 'INGRESO',
  PROCESO_INTERMEDIO: 'PROCESO INTERMEDIO',
  EMBOLSE_FINAL: 'EMBOLSE FINAL'
} as const;

export type LotTypeName = typeof LOT_TYPE_NAMES[keyof typeof LOT_TYPE_NAMES];

export const getLotTypeName = (lotTypes: LotType[], lotTypeId: string): LotTypeName | null => {
  const lotType = lotTypes.find(lt => lt.id === lotTypeId);
  if (!lotType) return null;
  
  // Map common lot type names to our business rules
  const name = lotType.name.toUpperCase();
  if (name.includes('SILOBOLSA')) return LOT_TYPE_NAMES.SILOBOLSA;
  if (name.includes('INGRESO')) return LOT_TYPE_NAMES.INGRESO;
  if (name.includes('PROCESO') && name.includes('INTERMEDIO')) return LOT_TYPE_NAMES.PROCESO_INTERMEDIO;
  if (name.includes('EMBOLSE') && name.includes('FINAL')) return LOT_TYPE_NAMES.EMBOLSE_FINAL;
  
  return null;
};

export const getOriginRequirement = (lotTypeName: LotTypeName | null) => {
  if (!lotTypeName) return { required: false, allowText: true, allowReference: true };
  
  switch (lotTypeName) {
    case LOT_TYPE_NAMES.SILOBOLSA:
      return { required: false, allowText: true, allowReference: false };
    case LOT_TYPE_NAMES.INGRESO:
      return { required: false, allowText: true, allowReference: true };
    case LOT_TYPE_NAMES.PROCESO_INTERMEDIO:
    case LOT_TYPE_NAMES.EMBOLSE_FINAL:
      return { required: true, allowText: false, allowReference: true };
    default:
      return { required: false, allowText: true, allowReference: true };
  }
};

export const getAllowedParentLotTypes = (lotTypeName: LotTypeName | null): LotTypeName[] => {
  if (!lotTypeName) return [];
  
  switch (lotTypeName) {
    case LOT_TYPE_NAMES.INGRESO:
      return [LOT_TYPE_NAMES.SILOBOLSA];
    case LOT_TYPE_NAMES.PROCESO_INTERMEDIO:
      return [LOT_TYPE_NAMES.SILOBOLSA, LOT_TYPE_NAMES.INGRESO];
    case LOT_TYPE_NAMES.EMBOLSE_FINAL:
      return [LOT_TYPE_NAMES.SILOBOLSA, LOT_TYPE_NAMES.INGRESO, LOT_TYPE_NAMES.PROCESO_INTERMEDIO];
    default:
      return [];
  }
};
