
import { useState, useEffect } from 'react';
import { Lot } from '@/types';
import { getLotTypeName, getOriginRequirement } from '@/utils/lotTypeUtils';
import { useLotTypes } from '@/hooks/useLotTypes';

export interface WizardData {
  lotTypeId?: string;
  hasOrigin?: boolean;
  originLotId?: string;
  originLot?: Lot;
  originText?: string;
  code?: string;
  amount?: number;
  varietyId?: string;
  categoryId?: string;
  plantId?: string;
  campaignId?: string;
  unitId?: string;
  notes?: string;
  isInherited?: boolean;
}

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const { data: lotTypes = [] } = useLotTypes();

  const updateWizardData = (data: Partial<WizardData>) => {
    console.log('🔄 updateWizardData called with:', data);
    
    setWizardData(prev => {
      const newData = { ...prev, ...data };
      
      // SIMPLIFIED: If we're setting an origin lot, immediately inherit ALL data
      if (data.originLot) {
        console.log('🔒 FORCING inheritance from origin lot:', data.originLot.code);
        
        newData.varietyId = data.originLot.varietyId;
        newData.categoryId = data.originLot.categoryId;
        newData.plantId = data.originLot.plantId;
        newData.campaignId = data.originLot.campaignId;
        newData.isInherited = true;
        
        console.log('✅ Inheritance complete - inherited data:', {
          varietyId: newData.varietyId,
          categoryId: newData.categoryId,
          plantId: newData.plantId,
          campaignId: newData.campaignId,
          isInherited: newData.isInherited
        });
      }
      
      return newData;
    });
  };

  const reset = () => {
    setCurrentStep(1);
    setWizardData({});
  };

  const getStepPath = (): number | null => {
    const lotTypeName = wizardData.lotTypeId 
      ? getLotTypeName(lotTypes, wizardData.lotTypeId)
      : null;
    
    const originReq = getOriginRequirement(lotTypeName);

    console.log('🚦 Step routing - Current step:', currentStep);
    console.log('📊 Origin lot present:', !!wizardData.originLot);
    console.log('🔒 Is inherited:', wizardData.isInherited);

    switch (currentStep) {
      case 1:
        if (!wizardData.lotTypeId) return null;
        
        if (lotTypeName === 'SILOBOLSA') {
          return 4; // Skip origin selection for SILOBOLSA
        } else if (originReq.required) {
          return 3; // Go directly to origin selection for mandatory types
        } else {
          return 2; // Ask user choice for optional types
        }

      case 2:
        if (wizardData.hasOrigin === undefined) return null;
        return wizardData.hasOrigin ? 3 : 4;

      case 3:
        if (!wizardData.originLotId) return null;
        return 4; // Always go to step 4 after selecting origin

      case 4:
        // SIMPLIFIED: Check based on origin lot presence, not hasOrigin flag
        if (!wizardData.code || !wizardData.amount || !wizardData.unitId) return null;
        
        // If we have an origin lot, only need the basic new lot data
        if (wizardData.originLot) {
          return 5;
        }
        
        // For completely new lots, need all master data
        if (!wizardData.varietyId || !wizardData.categoryId || !wizardData.plantId) {
          return null;
        }
        
        return 5;

      case 5:
        return null;

      default:
        return null;
    }
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!wizardData.lotTypeId;
      case 2:
        return wizardData.hasOrigin !== undefined;
      case 3:
        return !!wizardData.originLotId;
      case 4:
        if (!wizardData.code || !wizardData.amount || !wizardData.unitId) return false;
        
        // SIMPLIFIED: If we have origin lot, we're good to go
        if (wizardData.originLot) {
          return true;
        }
        
        // For new lots, need all master data
        return !!(wizardData.varietyId && wizardData.categoryId && wizardData.plantId);
      case 5:
        return true;
      default:
        return false;
    }
  };

  const canGoBack = (): boolean => {
    return currentStep > 1;
  };

  return {
    currentStep,
    wizardData,
    setCurrentStep,
    updateWizardData,
    reset,
    getStepPath,
    canGoNext,
    canGoBack
  };
};
