
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Save, 
  RotateCcw,
  FlaskConical,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Parameter {
  id: string;
  name: string;
  type: string;
  description?: string;
  testId: string;
  testName: string;
  existingStandards?: {
    [labelName: string]: {
      standardId: string;
      min: number;
      max: number;
    };
  };
}

interface RangeValue {
  min: string;
  max: string;
}

interface StandardsMatrix {
  [parameterId: string]: {
    retenido: RangeValue & { standardId?: string };
    standard: RangeValue & { standardId?: string };
    superior: RangeValue & { standardId?: string };
  };
}

interface ValidationError {
  parameterId: string;
  label: string;
  message: string;
}

interface StandardsTableCreationProps {
  parameters: Parameter[];
  labels: Array<{ id: string; name: string; description?: string }>;
  onSubmit: (standards: any[]) => Promise<void>;
  onUpdate?: (standardId: string, criteria: any) => Promise<void>;
  isLoading?: boolean;
}

const StandardsTableCreation: React.FC<StandardsTableCreationProps> = ({
  parameters,
  labels,
  onSubmit,
  onUpdate,
  isLoading = false
}) => {
  const [matrix, setMatrix] = useState<StandardsMatrix>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Helper function to normalize label names for consistent mapping
  const normalizeLabelName = (labelName: string): string => {
    const normalized = labelName.toLowerCase().trim();
    console.log(`🏷️ Normalizing label: "${labelName}" -> "${normalized}"`);
    
    // Handle all possible variations of label names
    if (normalized.includes('retenido')) return 'retenido';
    if (normalized.includes('standard') || normalized === 'calidad standard') return 'standard';
    if (normalized.includes('superior') || normalized === 'calidad superior') return 'superior';
    
    return normalized;
  };

  // Initialize matrix with existing values or empty values
  useEffect(() => {
    console.log('🔄 Initializing matrix with parameters:', parameters);
    console.log('🏷️ Available labels:', labels);
    
    const initialMatrix: StandardsMatrix = {};
    parameters.forEach(param => {
      console.log(`📋 Processing parameter ${param.name} with existing standards:`, param.existingStandards);
      
      // Initialize with empty values first
      initialMatrix[param.id] = {
        retenido: { min: '', max: '' },
        standard: { min: '', max: '' },
        superior: { min: '', max: '' }
      };
      
      // Fill in existing values if available
      if (param.existingStandards) {
        Object.entries(param.existingStandards).forEach(([existingLabelKey, existingData]) => {
          const normalizedKey = normalizeLabelName(existingLabelKey);
          console.log(`🔗 Mapping ${existingLabelKey} -> ${normalizedKey} with data:`, existingData);
          
          if (normalizedKey && initialMatrix[param.id][normalizedKey as keyof typeof initialMatrix[string]]) {
            initialMatrix[param.id][normalizedKey as keyof typeof initialMatrix[string]] = {
              min: existingData.min?.toString() || '',
              max: existingData.max?.toString() || '',
              standardId: existingData.standardId
            };
            console.log(`✅ Successfully mapped ${normalizedKey} for parameter ${param.name}:`, initialMatrix[param.id][normalizedKey as keyof typeof initialMatrix[string]]);
          } else {
            console.warn(`⚠️ Could not map label key: ${normalizedKey} for parameter ${param.name}`);
          }
        });
      }
      
      console.log(`📊 Final matrix for parameter ${param.name}:`, initialMatrix[param.id]);
    });
    
    console.log('✅ Complete initialized matrix:', initialMatrix);
    setMatrix(initialMatrix);
  }, [parameters]);

  // Real-time validation
  const validateRanges = (currentMatrix: StandardsMatrix) => {
    const errors: ValidationError[] = [];
    
    Object.entries(currentMatrix).forEach(([parameterId, ranges]) => {
      const parameter = parameters.find(p => p.id === parameterId);
      if (!parameter) return;

      // Check if values are numeric and valid
      const retenidoMin = parseFloat(ranges.retenido.min);
      const retenidoMax = parseFloat(ranges.retenido.max);
      const standardMin = parseFloat(ranges.standard.min);
      const standardMax = parseFloat(ranges.standard.max);
      const superiorMin = parseFloat(ranges.superior.min);
      const superiorMax = parseFloat(ranges.superior.max);

      // Validate individual ranges
      if (ranges.retenido.min && ranges.retenido.max) {
        if (retenidoMin >= retenidoMax) {
          errors.push({
            parameterId,
            label: 'retenido',
            message: 'Mínimo debe ser menor que máximo'
          });
        }
      }

      if (ranges.standard.min && ranges.standard.max) {
        if (standardMin >= standardMax) {
          errors.push({
            parameterId,
            label: 'standard',
            message: 'Mínimo debe ser menor que máximo'
          });
        }
      }

      if (ranges.superior.min && ranges.superior.max) {
        if (superiorMin >= superiorMax) {
          errors.push({
            parameterId,
            label: 'superior',
            message: 'Mínimo debe ser menor que máximo'
          });
        }
      }

      // Check for overlapping ranges (if all values are filled)
      const hasCompleteRanges = [
        ranges.retenido.min, ranges.retenido.max,
        ranges.standard.min, ranges.standard.max,
        ranges.superior.min, ranges.superior.max
      ].every(val => val !== '');

      if (hasCompleteRanges) {
        if (retenidoMax > standardMin) {
          errors.push({
            parameterId,
            label: 'overlap',
            message: 'Rangos de Retenido y Estándar se superponen'
          });
        }
        if (standardMax > superiorMin) {
          errors.push({
            parameterId,
            label: 'overlap',
            message: 'Rangos de Estándar y Superior se superponen'
          });
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const updateValue = (parameterId: string, label: string, field: 'min' | 'max', value: string) => {
    setMatrix(prev => {
      const newMatrix = {
        ...prev,
        [parameterId]: {
          ...prev[parameterId],
          [label]: {
            ...prev[parameterId][label],
            [field]: value
          }
        }
      };
      
      // Debounced validation
      setTimeout(() => validateRanges(newMatrix), 300);
      
      return newMatrix;
    });
  };

  const getFieldError = (parameterId: string, label: string) => {
    return validationErrors.find(err => 
      err.parameterId === parameterId && 
      (err.label === label || err.label === 'overlap')
    );
  };

  const hasParameterErrors = (parameterId: string) => {
    return validationErrors.some(err => err.parameterId === parameterId);
  };

  const getCompletionStatus = () => {
    const totalCells = parameters.length * 6; // 3 labels × 2 fields per label
    const filledCells = Object.values(matrix).reduce((count, ranges) => {
      return count + Object.values(ranges).reduce((labelCount, range) => {
        return labelCount + (range.min ? 1 : 0) + (range.max ? 1 : 0);
      }, 0);
    }, 0);
    
    return Math.round((filledCells / totalCells) * 100);
  };

  const hasExistingStandards = () => {
    return parameters.some(param => param.existingStandards && Object.keys(param.existingStandards).length > 0);
  };

  const handleSubmit = async () => {
    setIsValidating(true);
    const isValid = validateRanges(matrix);
    
    if (!isValid) {
      setIsValidating(false);
      return;
    }

    // Separate new standards from updates
    const newStandards: any[] = [];
    const updates: any[] = [];
    
    Object.entries(matrix).forEach(([parameterId, ranges]) => {
      const parameter = parameters.find(p => p.id === parameterId);
      if (!parameter) return;

      labels.forEach(label => {
        const normalizedLabelKey = normalizeLabelName(label.name);
        const range = ranges[normalizedLabelKey as keyof typeof ranges];
        
        if (range && range.min && range.max) {
          const standardData = {
            testId: parameter.testId,
            parameterId: parameter.id,
            labelId: label.id,
            criteria: {
              min: parseFloat(range.min),
              max: parseFloat(range.max)
            }
          };

          if (range.standardId) {
            // This is an update to existing standard
            updates.push({
              standardId: range.standardId,
              criteria: standardData.criteria
            });
          } else {
            // This is a new standard
            newStandards.push(standardData);
          }
        }
      });
    });

    try {
      console.log('🔄 Processing updates:', updates);
      console.log('🆕 Processing new standards:', newStandards);
      
      // Handle updates first
      for (const update of updates) {
        if (onUpdate) {
          await onUpdate(update.standardId, update.criteria);
        }
      }

      // Handle new standards
      if (newStandards.length > 0) {
        await onSubmit(newStandards);
      }

      // If no new standards but we had updates, show success message
      if (newStandards.length === 0 && updates.length > 0) {
        // The success message will be handled by the update mutation
      }
    } finally {
      setIsValidating(false);
    }
  };

  const resetMatrix = () => {
    const resetMatrix: StandardsMatrix = {};
    parameters.forEach(param => {
      resetMatrix[param.id] = {
        retenido: { min: '', max: '' },
        standard: { min: '', max: '' },
        superior: { min: '', max: '' }
      };
    });
    setMatrix(resetMatrix);
    setValidationErrors([]);
  };

  const completionPercentage = getCompletionStatus();
  const hasErrors = validationErrors.length > 0;
  const canSubmit = completionPercentage > 0 && !hasErrors && !isLoading;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-countryside-cream/30 to-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-countryside-green/10 rounded-lg">
                <FlaskConical className="h-5 w-5 text-countryside-green" />
              </div>
              <div>
                <CardTitle className="text-countryside-soil">
                  {hasExistingStandards() ? 'Editar Estándares de Calidad' : 'Crear Estándares de Calidad'}
                </CardTitle>
                <p className="text-sm text-countryside-brown mt-1">
                  {hasExistingStandards() 
                    ? 'Modifique los rangos existentes o agregue nuevos estándares'
                    : 'Configure los rangos para cada parámetro según las etiquetas de calidad'
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-countryside-green">
                {completionPercentage}%
              </div>
              <div className="text-xs text-countryside-brown">Completado</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                hasErrors ? "bg-red-400" : "bg-countryside-green"
              )}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Validation Alerts */}
      {hasErrors && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Hay {validationErrors.length} error(es) de validación. 
            Revise los campos marcados en rojo.
          </AlertDescription>
        </Alert>
      )}

      {/* Existing Standards Info */}
      {hasExistingStandards() && (
        <Alert className="border-blue-200 bg-blue-50">
          <Edit3 className="h-4 w-4" />
          <AlertDescription>
            Algunos parámetros ya tienen estándares definidos. Los valores existentes se muestran 
            en la tabla y pueden ser modificados.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Table */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-countryside-cream/20">
                <TableRow className="border-b-2 border-countryside-brown/10">
                  <TableHead className="font-semibold text-countryside-soil w-64">
                    Parámetro
                  </TableHead>
                  {labels.map(label => (
                    <TableHead key={label.id} className="text-center min-w-48">
                      <div className="space-y-1">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "font-medium border-2",
                            normalizeLabelName(label.name) === 'retenido' && "border-red-200 text-red-700 bg-red-50",
                            normalizeLabelName(label.name) === 'standard' && "border-blue-200 text-blue-700 bg-blue-50",
                            normalizeLabelName(label.name) === 'superior' && "border-green-200 text-green-700 bg-green-50"
                          )}
                        >
                          {label.name}
                        </Badge>
                        <div className="text-xs text-countryside-brown font-normal">
                          Min - Max
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {parameters.map((parameter, index) => (
                  <TableRow 
                    key={parameter.id}
                    className={cn(
                      "transition-colors hover:bg-countryside-cream/10",
                      hasParameterErrors(parameter.id) && "bg-red-50/50",
                      index % 2 === 0 && "bg-gray-50/30"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-countryside-soil">{parameter.name}</span>
                          {hasParameterErrors(parameter.id) && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {parameter.existingStandards && (
                            <Edit3 className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        <div className="text-xs text-countryside-brown">
                          {parameter.testName}
                        </div>
                        {parameter.description && (
                          <div className="text-xs text-countryside-brown/70">
                            {parameter.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    {labels.map(label => {
                      const normalizedLabelKey = normalizeLabelName(label.name);
                      const range = matrix[parameter.id]?.[normalizedLabelKey as keyof typeof matrix[string]];
                      const fieldError = getFieldError(parameter.id, normalizedLabelKey);
                      const hasExistingValue = parameter.existingStandards?.[label.name.toLowerCase()] || 
                                             parameter.existingStandards?.[label.name];
                      
                      console.log(`🎯 Rendering cell for ${parameter.name} - ${label.name}:`, {
                        normalizedLabelKey,
                        range,
                        hasExistingValue,
                        existingStandards: parameter.existingStandards
                      });
                      
                      return (
                        <TableCell key={label.id} className="text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={range?.min || ''}
                              onChange={(e) => updateValue(parameter.id, normalizedLabelKey, 'min', e.target.value)}
                              className={cn(
                                "w-20 text-center text-sm",
                                fieldError && "border-red-300 bg-red-50",
                                hasExistingValue && "bg-blue-50 border-blue-200"
                              )}
                              step="0.01"
                            />
                            <span className="text-countryside-brown/60 text-sm">-</span>
                            <Input
                              type="number"
                              placeholder="Max"
                              value={range?.max || ''}
                              onChange={(e) => updateValue(parameter.id, normalizedLabelKey, 'max', e.target.value)}
                              className={cn(
                                "w-20 text-center text-sm",
                                fieldError && "border-red-300 bg-red-50",
                                hasExistingValue && "bg-blue-50 border-blue-200"
                              )}
                              step="0.01"
                            />
                          </div>
                          {fieldError && (
                            <div className="text-xs text-red-600 mt-1">
                              {fieldError.message}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-0 shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-sm text-countryside-brown">
            <Info className="h-4 w-4" />
            Los rangos deben ser progresivos y no superponerse
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={resetMatrix}
              disabled={isLoading || isValidating}
              className="text-countryside-brown border-countryside-brown/30"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar Todo
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isValidating}
              className="bg-countryside-green hover:bg-countryside-green-dark"
            >
              {isLoading || isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {hasExistingStandards() ? 'Actualizar Estándares' : 'Guardar Estándares'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StandardsTableCreation;
