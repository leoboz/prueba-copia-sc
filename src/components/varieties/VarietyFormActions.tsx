
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface VarietyFormActionsProps {
  isSubmitting: boolean;
  isLoadingCrops: boolean;
  isLoadingTechnologies: boolean;
  isFormValid: boolean;
  onCancel?: () => void;
  cancelPath?: string;
  submitText?: string;
}

const VarietyFormActions: React.FC<VarietyFormActionsProps> = ({
  isSubmitting,
  isLoadingCrops,
  isLoadingTechnologies,
  isFormValid,
  onCancel,
  cancelPath = '/varieties',
  submitText = 'Crear Variedad',
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(cancelPath);
    }
  };

  return (
    <div className="flex gap-4 pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        className="border-navy-200 text-navy-600 hover:bg-navy-50"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || isLoadingCrops || isLoadingTechnologies || !isFormValid}
        className="bg-navy-900 hover:bg-navy-800 text-white"
      >
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        {submitText}
      </Button>
    </div>
  );
};

export default VarietyFormActions;
