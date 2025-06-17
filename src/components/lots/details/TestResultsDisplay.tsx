
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestResult } from '@/types';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useTestResults } from '@/hooks/useTestResults';
import { useParameterLabels } from '@/hooks/useParameterLabels';

interface TestResultsDisplayProps {
  sampleId?: string;
  testResults?: TestResult[];
  sampleIds?: string[];
  formatDate: (dateString: string) => string;
  onResultsSaved: () => void;
}

const TestResultsDisplay: React.FC<TestResultsDisplayProps> = ({ 
  sampleId, 
  testResults: propTestResults, 
  sampleIds = [],
  formatDate, 
  onResultsSaved 
}) => {
  const { useSingleSampleResults } = useTestResults();
  
  // Use React Query hook if sampleId is provided, otherwise use prop data
  const { data: queryTestResults, isLoading: testResultsLoading } = useSingleSampleResults(
    sampleId && !propTestResults ? sampleId : null
  );
  
  // Get all sample IDs that have test results for parameter labels
  const allSampleIds = propTestResults 
    ? [...new Set(propTestResults.map(r => r.sampleId).filter(Boolean))] as string[]
    : sampleIds;
  
  // Get parameter labels for the samples
  const { data: parameterLabels, isLoading: labelsLoading } = useParameterLabels(allSampleIds);
  
  const testResults = propTestResults || queryTestResults || [];
  const isLoading = testResultsLoading || labelsLoading;
  
  console.log('🧪 TestResultsDisplay - testResults:', testResults);
  console.log('🏷️ TestResultsDisplay - parameterLabels:', parameterLabels);
  console.log('📋 TestResultsDisplay - allSampleIds:', allSampleIds);

  // Create a map of parameter names to their labels
  const parameterLabelMap = new Map();
  parameterLabels?.forEach(item => {
    parameterLabelMap.set(item.parameter, item.label);
  });

  console.log('🗺️ Parameter label map:', Object.fromEntries(parameterLabelMap));

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30">
        <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
            <Loader2 className="h-6 w-6 animate-spin" />
            Cargando Resultados...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-navy-400 animate-spin" />
            </div>
            <p className="text-navy-700 text-lg font-medium">Cargando resultados de pruebas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!testResults || testResults.length === 0) {
    return (
      <Card className="overflow-hidden border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30">
        <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
            <TrendingUp className="h-6 w-6" />
            Resultados de Pruebas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-navy-400" />
            </div>
            <p className="text-navy-700 text-lg font-medium">No hay resultados disponibles</p>
            <p className="text-navy-500 text-sm mt-2">
              Los resultados aparecerán aquí una vez que se completen las pruebas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30">
      <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <CardTitle className="text-xl font-serif flex items-center gap-2">
          <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
          <TrendingUp className="h-6 w-6" />
          Resultados de Pruebas
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
            {testResults.length} parámetro{testResults.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {testResults.map((result, index) => {
            console.log('🔬 Rendering test result:', {
              index,
              parameterId: result.parameterId,
              parameterName: result.parameter?.name,
              value: result.value,
              createdAt: result.createdAt,
              sampleId: result.sampleId
            });
            
            // Get the parameter label from our map using the parameter name
            const parameterLabel = parameterLabelMap.get(result.parameter?.name);
            console.log(`🎯 Label for parameter "${result.parameter?.name}":`, parameterLabel);
            
            const labelConfig = getLabelConfig(parameterLabel);
            
            return (
              <div 
                key={`${result.parameterId}-${index}`} 
                className="group relative p-4 rounded-xl border border-navy-200/40 bg-gradient-to-br from-white to-navy-50/50 hover:shadow-lg transition-all duration-300 hover:border-navy-300/60 hover:bg-gradient-to-br hover:from-white hover:to-navy-100/60"
              >
                <div className="absolute top-3 right-3">
                  <labelConfig.icon className={`h-4 w-4 ${labelConfig.iconColor}`} />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-navy-800 group-hover:text-navy-900 transition-colors">
                      {result.parameter?.name || 'Parámetro Desconocido'}
                    </h3>
                    <p className="text-sm text-navy-500">
                      Actualizado: {formatDate(result.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-navy-800">
                        {result.value}
                      </span>
                      {result.parameter?.validation?.min !== undefined && result.parameter?.validation?.max !== undefined && (
                        <span className="text-sm text-navy-500">
                          / {result.parameter.validation.max}
                        </span>
                      )}
                    </div>
                    
                    {parameterLabel && (
                      <Badge className={`${labelConfig.bgColor} ${labelConfig.textColor} border-0 font-medium px-3 py-1 shadow-sm`}>
                        {parameterLabel}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Progress bar for numeric values */}
                  {typeof result.value === 'number' && result.parameter?.validation?.max && (
                    <div className="w-full bg-navy-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${labelConfig.progressColor}`}
                        style={{ 
                          width: `${Math.min((result.value / result.parameter.validation.max) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary footer */}
        <div className="mt-6 pt-4 border-t border-navy-200/30">
          <div className="flex items-center justify-between text-sm text-navy-600">
            <span>Total de parámetros evaluados</span>
            <span className="font-medium text-navy-800">{testResults.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getLabelConfig = (label: string | null | undefined) => {
  const labelLower = label?.toLowerCase();
  switch (true) {
    case labelLower?.includes('superior'):
      return {
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        icon: Award,
        iconColor: 'text-emerald-600',
        progressColor: 'bg-emerald-500'
      };
    case labelLower?.includes('standard'):
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        icon: CheckCircle2,
        iconColor: 'text-blue-600',
        progressColor: 'bg-blue-500'
      };
    case labelLower?.includes('retenido'):
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: AlertTriangle,
        iconColor: 'text-red-600',
        progressColor: 'bg-red-500'
      };
    default:
      return {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: CheckCircle2,
        iconColor: 'text-gray-600',
        progressColor: 'bg-gray-500'
      };
  }
};

export default TestResultsDisplay;
