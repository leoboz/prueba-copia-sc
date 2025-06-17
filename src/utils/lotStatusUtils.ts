import { LotLabel } from '@/hooks/useLotLabels';

export type LotStatus = 'superior' | 'standard' | 'retenido' | 'no_analizado' | 'pgo';

export interface LotWithLabels {
  id: string;
  status: string;
  code?: string;
  calculated_label_id?: string;
  final_label_id?: string;
  pgo_override_reason?: string;
  pgo_overridden_by?: string;
  pgo_overridden_at?: string;
}

// Static fallback labels
const fallbackLabels: LotLabel[] = [
  { id: '9d9986ea-fd13-427a-b11b-304e9f6cd49a', name: 'No analizado', description: 'Lote sin análisis de muestras', created_at: '2025-06-04T12:09:59.618159+00', updated_at: '2025-06-04T12:09:59.618159+00' },
  { id: '19d01740-95c1-4c1c-a01d-2e86e1adf2d0', name: 'Retenido', description: 'Lote retenido por no cumplir estándares', created_at: '2025-06-04T12:09:59.618159+00', updated_at: '2025-06-04T12:09:59.618159+00' },
  { id: '22bac169-3eb7-4f06-8cf3-ed1198550cfd', name: 'Standard', description: 'Lote que cumple estándares básicos', created_at: '2025-06-04T12:09:59.618159+00', updated_at: '2025-06-04T12:09:59.618159+00' },
  { id: '4b67040b-48a2-49e5-bf18-a3b7a25481e4', name: 'Superior', description: 'Lote que cumple estándares superiores', created_at: '2025-06-04T12:09:59.618159+00', updated_at: '2025-06-04T12:09:59.618159+00' },
  { id: '865fd27e-59e6-4d3e-b998-4c54480d6d94', name: 'PGO', description: 'Lote liberado manualmente por empresa genética', created_at: '2025-06-04T12:09:59.618159+00', updated_at: '2025-06-04T12:09:59.618159+00' },
];

/**
 * Get the effective label for a lot considering both calculated and final (PGO) labels
 */
export const getEffectiveLotLabel = (lot: LotWithLabels, labels: LotLabel[] = []): LotLabel | null => {
  const effectiveLabels = labels.length > 0 ? labels : fallbackLabels;
  console.log('DEBUG: getEffectiveLotLabel:', { 
    lotId: lot.id, 
    calculated_label_id: lot.calculated_label_id, 
    final_label_id: lot.final_label_id, 
    labels: effectiveLabels.map(l => ({ id: l.id, name: l.name })) 
  });

  if (lot.final_label_id) {
    const finalLabel = effectiveLabels.find(label => label.id === lot.final_label_id);
    if (!finalLabel) {
      console.warn(`WARNING: Final label ID ${lot.final_label_id} not found for lot ${lot.id}`);
    }
    return finalLabel || null;
  }
  
  if (lot.calculated_label_id) {
    const calculatedLabel = effectiveLabels.find(label => label.id === lot.calculated_label_id);
    if (!calculatedLabel) {
      console.warn(`WARNING: Calculated label ID ${lot.calculated_label_id} not found for lot ${lot.id}`);
    }
    return calculatedLabel || null;
  }
  
  const noAnalizadoLabel = effectiveLabels.find(label => label.name === 'No analizado');
  if (!noAnalizadoLabel) {
    console.warn('WARNING: No analizado label not found');
    return null;
  }
  return noAnalizadoLabel;
};

/**
 * Check if a lot has a PGO override applied
 */
export const hasPGOOverride = (lot: LotWithLabels): boolean => {
  return !!(lot.final_label_id && lot.pgo_override_reason);
};

/**
 * Get the status color for a lot label
 */
export const getLotLabelColor = (labelName: string): string => {
  switch (labelName?.toLowerCase()) {
    case 'superior':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'standard':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'retenido':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'pgo':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'no analizado':
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Get the icon for a lot label
 */
export const getLotLabelIcon = (labelName: string): string => {
  switch (labelName?.toLowerCase()) {
    case 'superior':
      return 'CheckCircle';
    case 'standard':
      return 'Circle';
    case 'retenido':
      return 'XCircle';
    case 'pgo':
      return 'Shield';
    case 'no analizado':
    default:
      return 'Clock';
  }
};

/**
 * Calculate lot label based on sample results
 * This implements the "most demanding criteria" rule
 */
export const calculateLotLabel = (sampleLabels: string[], labels: LotLabel[] = []): LotLabel | null => {
  if (!sampleLabels.length) {
    return labels.find(label => label.name === 'No analizado') || null;
  }

  if (sampleLabels.includes('Retenido')) {
    return labels.find(label => label.name === 'Retenido') || null;
  }

  if (sampleLabels.includes('Standard')) {
    return labels.find(label => label.name === 'Standard') || null;
  }

  if (sampleLabels.every(label => label === 'Superior')) {
    return labels.find(label => label.name === 'Superior') || null;
  }

  return labels.find(label => label.name === 'Standard') || null;
};