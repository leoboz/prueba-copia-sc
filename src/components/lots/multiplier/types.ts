
import { Lot } from '@/types';

export interface ColumnConfig {
  id: string;
  label: string;
  width: number;
  defaultVisible: boolean;
  sortable: boolean;
  type: 'text' | 'date' | 'number' | 'status' | 'badge' | 'boolean';
  accessor: string;
  formatter?: (value: any, lot: Lot) => string | React.ReactNode;
}

export interface FilterState {
  search: string;
  status: string;
  variety: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  hasOverride: boolean | undefined;
  hasSamples: boolean | undefined;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  {
    id: 'code',
    label: 'Código',
    width: 120,
    defaultVisible: true,
    sortable: true,
    type: 'text',
    accessor: 'code'
  },
  {
    id: 'variety',
    label: 'Variedad',
    width: 150,
    defaultVisible: true,
    sortable: true,
    type: 'text',
    accessor: 'variety.name'
  },
  {
    id: 'crop',
    label: 'Cultivo',
    width: 120,
    defaultVisible: true,
    sortable: true,
    type: 'text',
    accessor: 'variety.crop.name'
  },
  {
    id: 'status',
    label: 'Estado',
    width: 100,
    defaultVisible: true,
    sortable: true,
    type: 'status',
    accessor: 'status'
  },
  {
    id: 'createdAt',
    label: 'Fecha Creación',
    width: 130,
    defaultVisible: true,
    sortable: true,
    type: 'date',
    accessor: 'createdAt'
  },
  {
    id: 'amount',
    label: 'Cantidad',
    width: 100,
    defaultVisible: true,
    sortable: true,
    type: 'number',
    accessor: 'amount'
  },
  {
    id: 'unit',
    label: 'Unidad',
    width: 80,
    defaultVisible: false,
    sortable: true,
    type: 'text',
    accessor: 'unit.name'
  },
  {
    id: 'plant',
    label: 'Planta',
    width: 120,
    defaultVisible: false,
    sortable: true,
    type: 'text',
    accessor: 'plant.name'
  },
  {
    id: 'campaign',
    label: 'Campaña',
    width: 120,
    defaultVisible: false,
    sortable: true,
    type: 'text',
    accessor: 'campaign.name'
  },
  {
    id: 'category',
    label: 'Categoría',
    width: 120,
    defaultVisible: false,
    sortable: true,
    type: 'text',
    accessor: 'category.name'
  },
  {
    id: 'originLot',
    label: 'Lote Origen',
    width: 120,
    defaultVisible: false,
    sortable: true,
    type: 'text',
    accessor: 'originLot.code'
  },
  {
    id: 'user',
    label: 'Multiplicador',
    width: 150,
    defaultVisible: false,
    sortable: true,
    type: 'text',
    accessor: 'user.name'
  },
  {
    id: 'sampleCount',
    label: 'Muestras',
    width: 80,
    defaultVisible: true,
    sortable: true,
    type: 'number',
    accessor: 'samples'
  },
  {
    id: 'qualityLabel',
    label: 'Calidad',
    width: 100,
    defaultVisible: true,
    sortable: false,
    type: 'badge',
    accessor: 'qualityLabel'
  },
  {
    id: 'overridden',
    label: 'Sobreescrito',
    width: 100,
    defaultVisible: false,
    sortable: true,
    type: 'boolean',
    accessor: 'overridden'
  },
  {
    id: 'qrUrl',
    label: 'QR Código',
    width: 100,
    defaultVisible: false,
    sortable: false,
    type: 'boolean',
    accessor: 'qrUrl'
  }
];
