
import React from 'react';
import { Label } from '@/components/ui/label';
import { Parameter } from '@/types';
import ParameterInput from './ParameterInput';
import ParameterValidationStatus from './ParameterValidationStatus';
import ParameterTooltip from './ParameterTooltip';

interface ParameterInputGroupProps {
  parameter: Parameter;
  value: any;
  isValid: boolean;
  readonly: boolean;
  onValueChange: (value: string | number | boolean) => void;
}

const ParameterInputGroup: React.FC<ParameterInputGroupProps> = ({
  parameter,
  value,
  isValid,
  readonly,
  onValueChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <Label htmlFor={parameter.id} className="md:col-span-1 flex items-center">
        {parameter.name}
        {parameter.validation?.required && <span className="text-red-500 ml-1">*</span>}
        {parameter.description && (
          <ParameterTooltip description={parameter.description} />
        )}
      </Label>
      <div className="md:col-span-1">
        <ParameterInput
          parameter={parameter}
          value={value}
          isValid={isValid}
          readonly={readonly}
          onValueChange={onValueChange}
        />
      </div>
      <div className="md:col-span-1 flex items-center">
        <ParameterValidationStatus isValid={isValid} />
      </div>
    </div>
  );
};

export default ParameterInputGroup;
