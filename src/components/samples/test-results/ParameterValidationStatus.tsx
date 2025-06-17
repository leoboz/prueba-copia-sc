
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ParameterValidationStatusProps {
  isValid: boolean;
}

const ParameterValidationStatus: React.FC<ParameterValidationStatusProps> = ({ isValid }) => {
  if (isValid) {
    return (
      <div className="flex items-center text-countryside-green">
        <CheckCircle size={16} className="mr-1" />
        <span className="text-xs">Válido</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-red-500">
      <AlertCircle size={16} className="mr-1" />
      <span className="text-xs">Inválido</span>
    </div>
  );
};

export default ParameterValidationStatus;
