
import { Sample, TestResult, Parameter } from '@/types';

export interface SampleWithTestResults extends Sample {
  test_results?: Array<TestResult & {
    parameter?: Parameter;
  }>;
}

export interface LotWithDetails {
  id: string;
  code: string;
  varietyId: string;
  multiplierId: string;
  userId?: string;
  status: string;
  overridden: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  qrUrl?: string;
  createdAt: string;
  updatedAt: string;
  variety?: {
    id: string;
    name: string;
    crop?: {
      name: string;
    };
  };
  user?: {
    id: string;
    name: string;
    email?: string;
  };
  media?: Array<{
    id: string;
    url: string;
    type: string;
  }>;
  samples?: SampleWithTestResults[];
}
