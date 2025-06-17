
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

export interface LotTypeUnitPermission {
  id: string;
  lotTypeId: string;
  unitId: string;
  isAllowed: boolean;
}

// Enhanced Lot interface with new fields
export interface EnhancedLot {
  id: string;
  code: string;
  varietyId: string;
  userId: string;
  status: string;
  overridden: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  qrUrl?: string;
  createdAt: string;
  updatedAt: string;
  
  // New master data fields
  plantId?: string;
  campaignId?: string;
  categoryId?: string;
  unitId?: string;
  lotTypeId?: string;
  originLotId?: string;
  originText?: string;
  
  // Relationships
  variety?: {
    id: string;
    name: string;
    crop?: {
      name: string;
    };
  };
  plant?: Plant;
  campaign?: Campaign;
  category?: Category;
  unit?: Unit;
  lotType?: LotType;
  originLot?: EnhancedLot;
}

export interface TestResultWithSource {
  id: string;
  sampleId: string;
  testId: string;
  parameterId: string;
  value: string;
  isValid?: boolean;
  source: 'direct' | 'inherited';
  createdAt: string;
  updatedAt: string;
  parameter?: {
    id: string;
    name: string;
    type: string;
  };
}
