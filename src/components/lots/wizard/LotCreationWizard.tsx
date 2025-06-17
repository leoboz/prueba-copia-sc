
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LotTypeSelectionStep } from './steps/LotTypeSelectionStep';
import { OriginChoiceStep } from './steps/OriginChoiceStep';
import { OriginLotSelectionStep } from './steps/OriginLotSelectionStep';
import { NewLotDetailsStep } from './steps/NewLotDetailsStep';
import { LotCustomizationStep } from './steps/LotCustomizationStep';
import { LotReviewStep } from './steps/LotReviewStep';
import { useWizardState } from './hooks/useWizardState';

export const LotCreationWizard = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    wizardData,
    setCurrentStep,
    updateWizardData,
    reset,
    getStepPath,
    canGoNext,
    canGoBack
  } = useWizardState();

  const handleNext = () => {
    const nextStep = getStepPath();
    if (nextStep) {
      console.log('🔄 Moving to step:', nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (canGoBack()) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    reset();
    navigate('/lots');
  };

  const renderStep = () => {
    console.log('🎨 Rendering step:', currentStep);
    console.log('📊 Wizard data:', wizardData);
    
    switch (currentStep) {
      case 1:
        return (
          <LotTypeSelectionStep
            selectedLotTypeId={wizardData.lotTypeId}
            onSelect={(lotTypeId) => updateWizardData({ lotTypeId })}
          />
        );
      case 2:
        return (
          <OriginChoiceStep
            onChoice={(hasOrigin) => updateWizardData({ hasOrigin })}
          />
        );
      case 3:
        return (
          <OriginLotSelectionStep
            lotTypeId={wizardData.lotTypeId}
            selectedOriginLotId={wizardData.originLotId}
            onSelect={(originLotId, originLot) => 
              updateWizardData({ originLotId, originLot })
            }
          />
        );
      case 4:
        // SIMPLIFIED: Use origin lot presence as the single source of truth
        if (wizardData.originLot) {
          console.log('📝 Rendering LotCustomizationStep - origin lot detected');
          return (
            <LotCustomizationStep
              wizardData={wizardData}
              onUpdate={updateWizardData}
            />
          );
        } else {
          console.log('📝 Rendering NewLotDetailsStep - no origin lot');
          return (
            <NewLotDetailsStep
              wizardData={wizardData}
              onUpdate={updateWizardData}
            />
          );
        }
      case 5:
        return (
          <LotReviewStep
            wizardData={wizardData}
            onComplete={() => navigate('/lots')}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Seleccionar Tipo de Lote';
      case 2: return 'Elegir Origen';
      case 3: return 'Seleccionar Lote de Origen';
      case 4: 
        return wizardData.originLot 
          ? 'Personalizar Lote Heredado' 
          : 'Detalles del Lote';
      case 5: return 'Revisar y Crear';
      default: return 'Crear Lote';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-white font-bold drop-shadow-sm">
                {getStepTitle()}
              </h1>
              <p className="text-navy-200/90 text-lg font-medium mt-2">
                Paso {currentStep} de 5
                {wizardData.originLot && (
                  <span className="ml-2 text-green-300">• Heredando datos de {wizardData.originLot.code}</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    step <= currentStep
                      ? 'bg-white shadow-lg'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-navy-200/40 shadow-xl">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={canGoBack() ? handleBack : handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {canGoBack() ? 'Anterior' : 'Cancelar'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="bg-countryside-green hover:bg-countryside-green-dark flex items-center gap-2"
          >
            {currentStep === 5 ? 'Crear Lote' : 'Siguiente'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
