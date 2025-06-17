
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { Parameter, TestResult } from '@/types';
import { useTests } from '@/hooks/useTests';
import ParameterInputGroup from './ParameterInputGroup';
import { toast } from '@/hooks/use-toast';

interface TestResultFormProps {
  testIds: string[];
  sampleId: string;
  onSubmit: (results: Omit<TestResult, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
  existingResults?: TestResult[];
  isSubmitting?: boolean;
}

const TestResultForm: React.FC<TestResultFormProps> = ({
  testIds,
  sampleId,
  onSubmit,
  existingResults = [],
  isSubmitting = false,
}) => {
  const [results, setResults] = useState<Omit<TestResult, 'id' | 'createdAt' | 'updatedAt'>[]>([]);
  const { tests, getTestWithParameters, isLoading: testsLoading, error: testsError } = useTests();
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loadingParameters, setLoadingParameters] = useState(false);
  const [parametersError, setParametersError] = useState<string | null>(null);
  const [paramsInitialized, setParamsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  console.log('🧪 TestResultForm rendering with:', {
    testIds,
    sampleId,
    testsLoading,
    testsError: testsError?.message,
    testsCount: tests?.length || 0,
    paramsInitialized,
    parametersError
  });

  // Validate testIds early
  const validTestIds = useMemo(() => {
    if (!testIds || !Array.isArray(testIds)) {
      console.error('❌ Invalid testIds provided:', testIds);
      return [];
    }
    const filtered = testIds.filter(id => id && typeof id === 'string');
    console.log(`✅ Valid test IDs: ${filtered.length}/${testIds.length}`, filtered);
    return filtered;
  }, [testIds]);

  // Early return for invalid testIds
  if (validTestIds.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-lg">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-navy-800 mb-2">Error de Configuración</h3>
        <p className="text-navy-600 mb-4">
          {!testIds || !Array.isArray(testIds) 
            ? 'No se pudieron cargar los IDs de las pruebas. Por favor recargue la página.'
            : `Se proporcionaron ${testIds.length} IDs de prueba, pero ninguno es válido.`
          }
        </p>
        <div className="text-sm text-navy-500 bg-navy-50 p-3 rounded-lg">
          <strong>IDs recibidos:</strong> {JSON.stringify(testIds)}
        </div>
      </Card>
    );
  }

  const loadParameters = useCallback(async () => {
    if (!tests || tests.length === 0) {
      console.log('⏳ Tests not yet available, skipping parameter load');
      return;
    }

    if (paramsInitialized) {
      console.log('✅ Parameters already initialized, skipping');
      return;
    }

    console.log(`🔍 Loading parameters for test IDs: ${validTestIds.join(', ')}`);
    setLoadingParameters(true);
    setParametersError(null);

    try {
      // Find relevant tests first
      const relevantTests = tests.filter((test) => validTestIds.includes(test.id));
      console.log(`📋 Found ${relevantTests.length} relevant tests out of ${tests.length} total tests`);

      if (relevantTests.length === 0) {
        const availableTestIds = tests.map(t => t.id);
        const errorMsg = `No se encontraron pruebas para los IDs: ${validTestIds.join(', ')}. IDs disponibles: ${availableTestIds.join(', ')}`;
        console.error('❌', errorMsg);
        setParametersError(errorMsg);
        return;
      }

      const allParameters: Parameter[] = [];

      // Load parameters for each test
      for (const test of relevantTests) {
        console.log(`🔍 Loading parameters for test "${test.name}" (${test.id})`);
        
        try {
          // Try to get from already loaded test first
          if (test.parameters && test.parameters.length > 0) {
            console.log(`✅ Using cached parameters for test "${test.name}": ${test.parameters.length} parameters`);
            allParameters.push(...test.parameters);
          } else {
            // Fetch individual test with parameters
            console.log(`🔄 Fetching individual test data for "${test.name}"`);
            const testQuery = getTestWithParameters(test.id);
            
            // Wait for the query to resolve
            await new Promise<void>((resolve, reject) => {
              const checkQuery = () => {
                if (testQuery.data) {
                  console.log(`✅ Got individual test data for "${test.name}": ${testQuery.data.parameters?.length || 0} parameters`);
                  if (testQuery.data.parameters) {
                    allParameters.push(...testQuery.data.parameters);
                  }
                  resolve();
                } else if (testQuery.error) {
                  console.error(`❌ Error loading individual test "${test.name}":`, testQuery.error);
                  reject(testQuery.error);
                } else if (!testQuery.isLoading) {
                  console.warn(`⚠️ No data found for test "${test.name}"`);
                  resolve();
                } else {
                  // Still loading, check again
                  setTimeout(checkQuery, 100);
                }
              };
              checkQuery();
            });
          }
        } catch (testError) {
          console.error(`❌ Error loading parameters for test "${test.name}":`, testError);
          // Continue with other tests instead of failing completely
        }
      }

      console.log(`📊 Total parameters loaded: ${allParameters.length}`);

      if (allParameters.length === 0) {
        const errorMsg = 'No se encontraron parámetros para las pruebas seleccionadas. Verifique que las pruebas tengan parámetros configurados.';
        console.error('❌', errorMsg);
        setParametersError(errorMsg);
      } else {
        setParameters(allParameters);

        // Initialize results with existing values or defaults
        const initialResults = allParameters.map((param) => {
          const existingResult = existingResults.find((r) => r.parameterId === param.id);
          const result: Omit<TestResult, 'id' | 'createdAt' | 'updatedAt'> = {
            sampleId,
            testId: param.testId,
            parameterId: param.id,
            value: existingResult?.value || '',
            isValid: existingResult?.isValid ?? true,
            source: existingResult?.source || 'direct',
          };
          
          console.log(`🔧 Initialized result for parameter "${param.name}":`, result);
          return result;
        });

        setResults(initialResults);
        setParamsInitialized(true);
        setRetryCount(0);
        console.log('✅ Parameters successfully initialized');
      }
    } catch (error) {
      console.error('💥 Critical error loading parameters:', error);
      const errorMsg = error instanceof Error 
        ? `Error al cargar los parámetros: ${error.message}` 
        : 'Error desconocido al cargar los parámetros de prueba';
      setParametersError(errorMsg);
    } finally {
      setLoadingParameters(false);
    }
  }, [tests, validTestIds, sampleId, existingResults, getTestWithParameters, paramsInitialized]);

  useEffect(() => {
    if (tests && !paramsInitialized && !loadingParameters) {
      console.log('🔄 Effect triggered: loading parameters');
      loadParameters();
    }
  }, [tests, loadParameters, paramsInitialized, loadingParameters]);

  const handleRetry = useCallback(() => {
    console.log(`🔄 Retrying parameter load (attempt ${retryCount + 1})`);
    setRetryCount(prev => prev + 1);
    setParamsInitialized(false);
    setParametersError(null);
    setParameters([]);
    setResults([]);
  }, [retryCount]);

  const handleValueChange = useCallback((parameterId: string, value: string | number | boolean) => {
    setResults((prevResults) =>
      prevResults.map((result) =>
        result.parameterId === parameterId ? { ...result, value: String(value) } : result
      )
    );
  }, []);

  const validateParameter = useCallback((param: Parameter, value: any): boolean => {
    if (!param.validation) return true;

    switch (param.type) {
      case 'numeric':
      case 'number':
      case 'range':
        const numValue = Number(value);
        if (isNaN(numValue)) return false;
        if (param.validation.min !== undefined && numValue < param.validation.min) return false;
        if (param.validation.max !== undefined && numValue > param.validation.max) return false;
        if (param.validation.passThreshold !== undefined) {
          return numValue >= param.validation.passThreshold;
        }
        return true;
      case 'boolean':
        return true;
      case 'select':
        if (!param.validation.options) return true;
        return param.validation.options.includes(String(value));
      case 'text':
        if (param.validation.required && (!value || String(value).trim() === '')) {
          return false;
        }
        return true;
      default:
        return true;
    }
  }, []);

  const validatedResults = useMemo(() => {
    return results.map((result) => {
      const param = parameters.find((p) => p.id === result.parameterId);
      if (!param) return { ...result, isValid: true };
      const isValid = validateParameter(param, result.value);
      return { ...result, isValid };
    });
  }, [results, parameters, validateParameter]);

  // Update results with validation
  useEffect(() => {
    if (JSON.stringify(results) !== JSON.stringify(validatedResults)) {
      setResults(validatedResults);
    }
  }, [validatedResults, results]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (results.length === 0) {
      toast({
        title: 'Advertencia',
        description: 'No hay resultados para guardar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onSubmit(results);
    } catch (error) {
      console.error('Error submitting test results:', error);
    }
  };

  const parametersByTest = useMemo(() => {
    const grouped: Record<string, Parameter[]> = {};
    parameters.forEach((param) => {
      if (!grouped[param.testId]) {
        grouped[param.testId] = [];
      }
      grouped[param.testId].push(param);
    });
    return grouped;
  }, [parameters]);

  const allValid = results.every((result) => result.isValid);
  const hasValues = results.some((result) => result.value !== '');
  const isCompleted = existingResults.length > 0;

  // Show tests loading state
  if (testsLoading) {
    return (
      <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-navy-600 border-t-transparent mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-navy-800 mb-2">Cargando Plantillas de Prueba</h3>
        <p className="text-navy-600">Obteniendo información de las pruebas desde la base de datos...</p>
      </Card>
    );
  }

  // Show tests error state
  if (testsError) {
    return (
      <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-navy-800 mb-2">Error de Conexión</h3>
        <p className="text-navy-600 mb-4">No se pudieron cargar las plantillas de prueba desde la base de datos.</p>
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
          <strong>Error:</strong> {testsError.message}
        </div>
        <Button
          onClick={handleRetry}
          className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar Conexión
        </Button>
      </Card>
    );
  }

  // Show parameters loading state
  if (loadingParameters) {
    return (
      <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-navy-600 border-t-transparent mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-navy-800 mb-2">Cargando Parámetros</h3>
        <p className="text-navy-600">Preparando formulario de resultados...</p>
        <div className="text-sm text-navy-500 mt-2">
          Procesando {validTestIds.length} prueba{validTestIds.length !== 1 ? 's' : ''}...
        </div>
      </Card>
    );
  }

  // Show parameters error state
  if (parametersError) {
    return (
      <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-navy-800 mb-2">Error de Parámetros</h3>
        <p className="text-navy-600 mb-4">{parametersError}</p>
        <div className="text-sm text-navy-500 bg-navy-50 p-3 rounded-lg mb-4">
          <strong>IDs de prueba solicitados:</strong> {validTestIds.join(', ')}<br/>
          <strong>Intentos realizados:</strong> {retryCount + 1}
        </div>
        <Button
          onClick={handleRetry}
          className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar ({retryCount + 1})
        </Button>
      </Card>
    );
  }

  // Show no parameters state
  if (parameters.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-lg">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-semibold text-navy-800 mb-2">Sin Parámetros</h3>
        <p className="text-navy-600 mb-4">No hay parámetros definidos para las pruebas seleccionadas.</p>
        <div className="text-sm text-navy-500 bg-navy-50 p-3 rounded-lg mb-4">
          <strong>Pruebas solicitadas:</strong> {validTestIds.join(', ')}<br/>
          <strong>Total de pruebas disponibles:</strong> {tests?.length || 0}
        </div>
        <Button
          onClick={handleRetry}
          className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Recargar
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {tests?.filter((test) => validTestIds.includes(test.id)).map((test) => {
        const testParameters = parametersByTest[test.id] || [];
        if (testParameters.length === 0) return null;

        return (
          <Card
            key={test.id}
            className="bg-white/90 backdrop-blur-sm shadow-lg border-0 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-navy-700 to-blue-600 p-4">
              <h3 className="font-semibold text-lg text-white flex items-center">
                <CheckCircle className="mr-3 h-5 w-5" />
                {test.name}
                <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded">
                  {testParameters.length} parámetro{testParameters.length !== 1 ? 's' : ''}
                </span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {testParameters.map((param) => (
                <ParameterInputGroup
                  key={param.id}
                  parameter={param}
                  value={results.find((r) => r.parameterId === param.id)?.value}
                  isValid={results.find((r) => r.parameterId === param.id)?.isValid ?? true}
                  readonly={!!existingResults.find((r) => r.parameterId === param.id)}
                  onValueChange={(value) => handleValueChange(param.id, value)}
                />
              ))}
            </div>
          </Card>
        );
      })}

      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            type="submit"
            disabled={isSubmitting || isCompleted || !allValid || !hasValues}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting
              ? 'Guardando...'
              : isCompleted
                ? 'Resultados ya guardados'
                : 'Guardar Resultados'}
          </Button>

          {!allValid && hasValues && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="mr-2 h-4 w-4" />
              Hay valores inválidos que deben corregirse
            </div>
          )}
        </div>
      </Card>
    </form>
  );
};

export default TestResultForm;
