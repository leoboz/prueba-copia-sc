export type UserRole = 'admin' | 'geneticsCompany' | 'multiplier' | 'lab' | 'farmer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Variety {
  id: string;
  name: string;
  description?: string;
  cropId: string;
  technologyId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  crop?: {
    name: string;
  };
  technology?: {
    name: string;
  };
}

export interface VarietyPermission {
  id: string;
  varietyId: string;
  userId: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  constraints?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  variety?: {
    name: string;
    crop?: {
      name: string;
    }
  };
  user?: {
    name: string;
    email: string;
  };
}

export interface Test {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  parameters?: Parameter[];
}

export type ParameterType = 'numeric' | 'range' | 'boolean' | 'select' | 'text' | 'number';

export interface Parameter {
  id: string;
  testId: string;
  name: string;
  description?: string;
  type: ParameterType;
  validation: {
    min?: number;
    max?: number;
    options?: string[];
    passThreshold?: number;
    required: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type LotStatus = 'superior' | 'standard' | 'blocked' | 'retenido';

export type SampleStatus = 'submitted' | 'received' | 'confirmed' | 'testing' | 'completed';

export interface SampleType {
  id: string;
  name: string;
  description?: string;
}

export interface TestResult {
  id: string;
  sampleId: string;
  testId: string;
  parameterId: string;
  value: string;
  isValid?: boolean;
  source: 'direct' | 'inherited';
  createdAt: string;
  updatedAt: string;
  parameter?: Parameter;
  label?: string | null;
}

export interface Sample {
  id: string;
  lotId: string;
  userId: string;
  testIds: string[];
  internal_code?: string;
  status: SampleStatus;
  sampleTypeId: string;
  estimatedResultDate?: string;
  createdAt: string;
  updatedAt: string;
  labelId?: string;
  test_results?: Array<TestResult & {
    parameter?: Parameter;
  }>;
  lot?: {
    code: string;
    user?: User;
    variety?: Variety;
  };
}

export interface Lot {
  id: string;
  code: string;
  varietyId: string;
  userId: string;
  status: LotStatus;
  overridden?: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  qrUrl?: string;
  createdAt: string;
  updatedAt: string;
  
  // Master data fields
  plantId?: string;
  campaignId?: string;
  categoryId?: string;
  unitId?: string;
  lotTypeId?: string;
  originLotId?: string;
  originText?: string;
  amount?: number;
  
  // New label fields
  calculatedLabelId?: string;
  finalLabelId?: string;
  pgoOverrideReason?: string;
  pgoOverriddenBy?: string;
  pgoOverriddenAt?: string;
  
  // Relationships
  variety?: Variety;
  user?: User;
  plant?: Plant;
  campaign?: Campaign;
  category?: Category;
  unit?: Unit;
  lotType?: LotType;
  originLot?: Lot;
  samples: Sample[];
  media: Media[];
}

export interface Media {
  id: string;
  lotId: string;
  type: 'image' | 'video';
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface QRConfig {
  id: string;
  createdBy: string;
  displayFields: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ActionLog {
  id: string;
  userId: string;
  action: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface DashboardStats {
  totalLots: number;
  lotsByStatus: Record<LotStatus, number>;
  recentQRScans: number;
  averageTestResults: {
    pg?: number;
    vigor?: number;
    purity?: number;
  };
  labTurnaroundTimes: Record<string, number>;
}

export interface Standard {
  id: string;
  testId: string;
  parameterId: string;
  labelId: string;
  criteria: { min?: number; max?: number };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SampleStatusRecord {
  id: string;
  name: string;
  description?: string;
}

export interface SampleLabelDetail {
  id: string;
  name: string;
  description?: any;
}

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface CriteriaType {
  min?: number;
  max?: number;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plant {
  id: string;
  name: string;
  multiplierId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  name: string;
}

export interface LotType {
  id: string;
  name: string;
}

export * from './company';
export * from './organization';
export * from './lot-lookup';
export * from './master-data';
