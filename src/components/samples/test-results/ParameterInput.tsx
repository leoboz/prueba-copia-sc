
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Parameter } from '@/types';

interface ParameterInputProps {
  parameter: Parameter;
  value: any;
  isValid: boolean;
  readonly: boolean;
  onValueChange: (value: string | number | boolean) => void;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
  parameter,
  value,
  isValid,
  readonly,
  onValueChange
}) => {
  switch (parameter.type) {
    case 'numeric':
    case 'number':
      return (
        <div className="relative">
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className={`${!isValid ? 'border-red-500' : ''}`}
            min={parameter.validation?.min}
            max={parameter.validation?.max}
            required={parameter.validation?.required}
            readOnly={readonly}
          />
          {parameter.validation?.passThreshold !== undefined && (
            <div className="text-xs mt-1">
              Valor mínimo aceptable: {parameter.validation.passThreshold}
            </div>
          )}
          {!isValid && (
            <div className="text-xs text-red-500 mt-1">
              Valor fuera de rango permitido
            </div>
          )}
        </div>
      );
      
    case 'boolean':
      return (
        <Checkbox
          checked={value === true || value === 'true'}
          onCheckedChange={(checked) => onValueChange(!!checked)}
          disabled={readonly}
        />
      );
      
    case 'select':
      return (
        <Select
          value={String(value || '')}
          onValueChange={(val) => onValueChange(val)}
          disabled={readonly}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un valor" />
          </SelectTrigger>
          <SelectContent>
            {parameter.validation?.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
    case 'text':
    default:
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          required={parameter.validation?.required}
          disabled={readonly}
        />
      );
  }
};

export default ParameterInput;
