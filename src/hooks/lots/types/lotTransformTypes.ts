
export interface RawLotData {
  id: string;
  code: string;
  variety_id: string;
  user_id: string;
  status: string;
  overridden: boolean | null;
  override_reason: string | null;
  overridden_by: string | null;
  qr_url: string | null;
  created_at: string;
  updated_at: string;
  plant_id: string | null;
  campaign_id: string | null;
  category_id: string | null;
  unit_id: string | null;
  lot_type_id: string | null;
  origin_lot_id: string | null;
  origin_text: string | null;
  calculated_label_id: string | null;
  final_label_id: string | null;
  pgo_override_reason: string | null;
  pgo_overridden_by: string | null;
  pgo_overridden_at: string | null;
  amount: number | null;
  variety?: {
    id: string;
    name: string;
    created_by: string | null;
    crop?: {
      name: string;
    } | null;
  } | null;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  plant?: {
    id: string;
    name: string;
  } | null;
  campaign?: {
    id: string;
    name: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
  unit?: {
    id: string;
    name: string;
  } | null;
  lot_type?: {
    id: string;
    name: string;
  } | null;
  // FIXED: Ensure origin_lot is always an object, not array
  origin_lot?: {
    id: string;
    code: string;
    variety_id?: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
    variety?: {
      id: string;
      name: string;
      crop?: {
        name: string;
      } | null;
    } | null;
  } | null;
  samples?: RawSampleData[];
  media?: RawMediaData[];
}

export interface RawSampleData {
  id: string;
  user_id: string;
  test_ids: string[] | null;
  internal_code: string | null;
  status: string;
  sample_type_id: string;
  estimated_result_date: string | null;
  created_at: string;
  updated_at: string;
  test_results?: RawTestResultData[];
}

export interface RawTestResultData {
  id: string;
  parameter_id: string;
  value: string;
  created_at: string;
  parameter?: {
    id: string;
    name: string;
    type: string;
  } | null;
}

export interface RawMediaData {
  id: string;
  type: string;
  url: string;
  created_at: string;
  updated_at: string;
}
