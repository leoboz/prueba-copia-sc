
import { Lot, LotStatus, SampleStatus, ParameterType } from '@/types';
import { RawLotData } from '../types/lotTransformTypes';

export const transformLotData = (rawLot: RawLotData): Lot => {
  return {
    id: rawLot.id,
    code: rawLot.code,
    varietyId: rawLot.variety_id,
    userId: rawLot.user_id,
    status: 'retenido' as LotStatus, // Legacy compatibility
    overridden: rawLot.overridden || false,
    overrideReason: rawLot.override_reason || '',
    overriddenBy: rawLot.overridden_by || '',
    qrUrl: rawLot.qr_url || '',
    createdAt: rawLot.created_at,
    updatedAt: rawLot.updated_at,
    plantId: rawLot.plant_id,
    campaignId: rawLot.campaign_id,
    categoryId: rawLot.category_id,
    unitId: rawLot.unit_id,
    lotTypeId: rawLot.lot_type_id,
    originLotId: rawLot.origin_lot_id,
    originText: rawLot.origin_text,
    calculatedLabelId: rawLot.calculated_label_id,
    finalLabelId: rawLot.final_label_id,
    pgoOverrideReason: rawLot.pgo_override_reason,
    pgoOverriddenBy: rawLot.pgo_overridden_by,
    pgoOverriddenAt: rawLot.pgo_overridden_at,
    amount: rawLot.amount,
    variety: rawLot.variety ? {
      id: rawLot.variety.id,
      name: rawLot.variety.name,
      description: '',
      cropId: '',
      technologyId: undefined,
      createdBy: rawLot.variety.created_by || '',
      createdAt: '',
      updatedAt: '',
      crop: rawLot.variety.crop ? {
        name: rawLot.variety.crop.name
      } : undefined
    } : undefined,
    user: rawLot.user ? {
      id: rawLot.user.id,
      name: rawLot.user.name,
      email: rawLot.user.email,
      role: 'multiplier' as const
    } : undefined,
    plant: rawLot.plant ? {
      id: rawLot.plant.id,
      name: rawLot.plant.name,
      multiplierId: '',
      isVerified: false,
      createdAt: '',
      updatedAt: ''
    } : undefined,
    campaign: rawLot.campaign ? {
      id: rawLot.campaign.id,
      name: rawLot.campaign.name,
      createdAt: '',
      updatedAt: ''
    } : undefined,
    category: rawLot.category ? {
      id: rawLot.category.id,
      name: rawLot.category.name,
      createdAt: '',
      updatedAt: ''
    } : undefined,
    unit: rawLot.unit ? {
      id: rawLot.unit.id,
      name: rawLot.unit.name
    } : undefined,
    lotType: rawLot.lot_type ? {
      id: rawLot.lot_type.id,
      name: rawLot.lot_type.name
    } : undefined,
    // FIXED: Properly handle origin lot data - ensure it's always an object, not array
    originLot: rawLot.origin_lot && !Array.isArray(rawLot.origin_lot) ? {
      id: rawLot.origin_lot.id,
      code: rawLot.origin_lot.code,
      varietyId: rawLot.origin_lot.variety_id || '',
      userId: rawLot.origin_lot.user_id || '',
      status: 'retenido' as LotStatus,
      overridden: false,
      overrideReason: '',
      overriddenBy: '',
      qrUrl: '',
      createdAt: rawLot.origin_lot.created_at || '',
      updatedAt: rawLot.origin_lot.updated_at || '',
      samples: [],
      media: [],
      user: undefined,
      variety: rawLot.origin_lot.variety ? {
        id: rawLot.origin_lot.variety.id,
        name: rawLot.origin_lot.variety.name,
        description: '',
        cropId: '',
        technologyId: undefined,
        createdBy: '',
        createdAt: '',
        updatedAt: '',
        crop: rawLot.origin_lot.variety.crop ? {
          name: rawLot.origin_lot.variety.crop.name
        } : undefined
      } : undefined
    } : undefined,
    samples: (rawLot.samples || []).map(sample => ({
      id: sample.id,
      lotId: rawLot.id,
      userId: sample.user_id,
      testIds: sample.test_ids || [],
      internal_code: sample.internal_code,
      status: sample.status as SampleStatus,
      sampleTypeId: sample.sample_type_id,
      estimatedResultDate: sample.estimated_result_date,
      createdAt: sample.created_at,
      updatedAt: sample.updated_at,
      test_results: (sample.test_results || []).map(result => ({
        id: result.id,
        sampleId: sample.id,
        testId: '',
        parameterId: result.parameter_id,
        value: result.value,
        source: 'direct' as const,
        createdAt: result.created_at,
        updatedAt: '',
        parameter: result.parameter ? {
          id: result.parameter.id,
          testId: '',
          name: result.parameter.name,
          type: result.parameter.type as ParameterType,
          description: '',
          validation: { required: false },
          createdAt: '',
          updatedAt: ''
        } : undefined
      }))
    })),
    media: (rawLot.media || []).map(media => ({
      id: media.id,
      lotId: rawLot.id,
      type: media.type as 'image' | 'video',
      url: media.url,
      createdAt: media.created_at,
      updatedAt: media.updated_at
    }))
  };
};

export const transformLotsData = (rawLots: RawLotData[]): Lot[] => {
  return rawLots.map(transformLotData);
};
