
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FlaskConical, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sample, TestResult } from '@/types';
import TestResultForm from './test-results/TestResultForm';
import { toast } from '@/hooks/use-toast';
import { useTestResultsEnhanced } from '@/hooks/useTestResultsEnhanced';

interface TestResultsCardProps {
  sample: Sample;
  userRole: 'multiplier' | 'lab';
  getSampleResults?: (sampleId: string) => Promise<TestResult[]>;
  saveTestResults?: {
    mutateAsync: (params: { results: Omit<TestResult, 'id' | 'createdAt' | 'updatedAt'>[]; sampleId: string }) => Promise<any>;
  };
  onStatusUpdate?: (sampleId: string, status: Sample['status']) => Promise<void>;
}

const MAX_FETCH_ATTEMPTS = 3;
const FETCH_RETRY_DELAY = 1500; // 1.5 seconds

const TestResultsCard: React.FC<TestResultsCardProps> = ({ 
  sample, 
  userRole, 
  getSampleResults: propGetSampleResults,
  saveTestResults: propSaveTestResults,
  onStatusUpdate 
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use enhanced hook as fallback if props not provided
  const enhancedHook = useTestResultsEnhanced();
  const getSampleResults = propGetSampleResults || enhancedHook.getSampleResults;
  const saveTestResults = propSaveTestResults || enhancedHook.saveTestResults;
  
  const canShowTestResults = useCallback(() => {
    if (userRole === 'lab') {
      return sample.status === 'testing' || sample.status === 'completed';
    } else {
      return sample.status === 'completed';
    }
  }, [sample.status, userRole]);
  
  // Check if sample has valid testIds
  const hasValidTestIds = sample.testIds && Array.isArray(sample.testIds) && sample.testIds.length > 0;
  
  console.log('🧪 TestResultsCard rendering for sample:', {
    sampleId: sample.id,
    status: sample.status,
    userRole,
    testIds: sample.testIds,
    hasValidTestIds,
    canShow: canShowTestResults(),
    resultsLoaded,
    testResultsCount: testResults.length
  });
  
  const fetchResults = useCallback(async (attempt = 0) => {
    if (attempt >= MAX_FETCH_ATTEMPTS) {
      console.log(`⚠️ Maximum load attempts (${MAX_FETCH_ATTEMPTS}) reached for sample ${sample.id}. Stopping fetches.`);
      setLoadError(`No se pudieron cargar los resultados después de ${MAX_FETCH_ATTEMPTS} intentos. Verifique la conexión e intente nuevamente.`);
      return;
    }
    
    if (resultsLoaded && attempt === 0) {
      console.log(`✅ Results already loaded for sample ${sample.id}, skipping fetch`);
      return;
    }
    
    console.log(`🔄 Attempt ${attempt + 1}/${MAX_FETCH_ATTEMPTS}: Fetching test results for sample ${sample.id}`);
    setIsLoading(true);
    setLoadError(null);
    
    try {
      const results = await getSampleResults(sample.id);
      console.log(`📊 Attempt ${attempt + 1}: Fetched ${results.length} results for sample ${sample.id}:`, results);
      
      if (results && results.length > 0) {
        setTestResults(results);
        setResultsLoaded(true);
        setLoadAttempts(0);
        console.log(`✅ Successfully loaded ${results.length} test results for sample ${sample.id}`);
      } else if (attempt < MAX_FETCH_ATTEMPTS - 1) {
        console.log(`⏳ No test results found for sample ${sample.id}, will retry after ${FETCH_RETRY_DELAY}ms delay`);
        setTimeout(() => fetchResults(attempt + 1), FETCH_RETRY_DELAY);
        return; // Don't update isLoading yet
      } else {
        console.log(`⚠️ No test results found for sample ${sample.id} after all ${MAX_FETCH_ATTEMPTS} attempts`);
        setResultsLoaded(true); // Mark as loaded anyway to avoid infinite retries
        setTestResults([]);
      }
    } catch (error) {
      console.error(`💥 Attempt ${attempt + 1}/${MAX_FETCH_ATTEMPTS}: Error fetching test results for sample ${sample.id}:`, error);
      
      if (attempt < MAX_FETCH_ATTEMPTS - 1) {
        console.log(`🔄 Will retry after ${FETCH_RETRY_DELAY}ms delay`);
        setTimeout(() => fetchResults(attempt + 1), FETCH_RETRY_DELAY);
        return; // Don't update error state yet
      } else {
        const errorMsg = error instanceof Error 
          ? `Error al cargar resultados: ${error.message}` 
          : 'No se pudieron cargar los resultados. Por favor intente nuevamente.';
        setLoadError(errorMsg);
      }
    } finally {
      setIsLoading(false);
      setLoadAttempts(attempt + 1);
    }
  }, [sample.id, getSampleResults, resultsLoaded]);
  
  useEffect(() => {
    if (canShowTestResults() && hasValidTestIds && !resultsLoaded) {
      console.log(`🔄 Effect triggered: loading test results for sample ${sample.id}`);
      fetchResults();
    }
  }, [fetchResults, canShowTestResults, hasValidTestIds, resultsLoaded]);
  
  const handleRetryLoad = () => {
    console.log(`🔄 Manual retry: test results fetch for sample ${sample.id}`);
    setLoadAttempts(0);
    setResultsLoaded(false);
    setLoadError(null);
    setTestResults([]);
    fetchResults();
  };
  
  const handleResultsSubmit = async (results: Omit<TestResult, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    try {
      console.log(`💾 Submitting ${results.length} test results for sample ${sample.id}:`, results);
      setIsSubmitting(true);
      
      if (!results || results.length === 0) {
        toast({
          title: "Error",
          description: "No hay resultados para guardar.",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`📤 Saving test results to database for sample ${sample.id}...`);
      await saveTestResults.mutateAsync({ 
        results, 
        sampleId: sample.id 
      });
      
      console.log(`✅ Test results saved successfully for sample ${sample.id}, updating sample status...`);
      
      // Update sample status if needed
      if (sample.status === 'testing' && onStatusUpdate) {
        console.log(`🔄 Updating sample ${sample.id} status to completed...`);
        await onStatusUpdate(sample.id, 'completed');
        console.log(`✅ Sample ${sample.id} status updated to completed`);
      }
      
      // Force refresh results after saving
      console.log(`🔄 Refreshing test results after save for sample ${sample.id}...`);
      setResultsLoaded(false);
      setTimeout(() => {
        fetchResults();
      }, 2000); // Increased delay to ensure database updates are reflected
      
      toast({
        title: "Éxito",
        description: "Resultados guardados correctamente.",
      });
      
    } catch (error: any) {
      console.error(`💥 Error saving test results for sample ${sample.id}:`, error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron guardar los resultados. Por favor intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log(`🏁 Results submission process completed for sample ${sample.id}`);
    }
  };

  if (!canShowTestResults()) {
    console.log(`🚫 Cannot show test results for sample ${sample.id} - status: ${sample.status}, userRole: ${userRole}`);
    return null;
  }

  // If sample doesn't have valid testIds, show error message
  if (!hasValidTestIds) {
    console.log(`❌ Sample ${sample.id} doesn't have valid testIds:`, sample.testIds);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FlaskConical className="mr-2 h-5 w-5" />
            Resultados de Pruebas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <p className="text-countryside-soil">Error de configuración</p>
            <p className="text-countryside-brown text-sm mt-1">
              Esta muestra no tiene pruebas asignadas. Contacte al administrador.
            </p>
            <div className="text-xs text-countryside-brown/70 bg-countryside-amber/10 p-2 rounded mt-2">
              ID de muestra: {sample.id}<br/>
              IDs de prueba: {JSON.stringify(sample.testIds)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FlaskConical className="mr-2 h-5 w-5" />
          Resultados de Pruebas
          {testResults.length > 0 && (
            <span className="ml-auto text-sm bg-countryside-green/20 text-countryside-green-dark px-2 py-1 rounded">
              {testResults.length} resultado{testResults.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark"></div>
            <span className="ml-2">Cargando resultados...</span>
            <div className="ml-4 text-sm text-countryside-brown/70">
              Intento {loadAttempts + 1}/{MAX_FETCH_ATTEMPTS}
            </div>
          </div>
        ) : loadError ? (
          <div className="text-center py-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <p className="text-countryside-soil">{loadError}</p>
            <div className="text-sm text-countryside-brown/70 bg-countryside-amber/10 p-2 rounded mt-2 mb-4">
              Intentos realizados: {loadAttempts}<br/>
              ID de muestra: {sample.id}
            </div>
            <Button 
              className="mt-4 bg-countryside-amber text-countryside-soil hover:bg-countryside-amber-dark"
              onClick={handleRetryLoad}
              disabled={isSubmitting}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            {(testResults.length === 0 && userRole === 'lab' && sample.status === 'testing') ? (
              <div className="py-4">
                <TestResultForm
                  testIds={sample.testIds || []}
                  sampleId={sample.id}
                  onSubmit={handleResultsSubmit}
                  existingResults={[]}
                  isSubmitting={isSubmitting}
                />
              </div>
            ) : testResults.length === 0 ? (
              <div className="text-center py-4">
                <AlertCircle className="mx-auto h-12 w-12 text-countryside-amber mb-2" />
                <p className="text-countryside-soil">No se han registrado resultados</p>
                {userRole === 'lab' && sample.status === 'testing' && (
                  <>
                    <p className="text-countryside-brown text-sm mt-1">Ingrese los resultados de las pruebas para completar el análisis</p>
                    <Button 
                      className="mt-4 bg-countryside-amber text-countryside-soil hover:bg-countryside-amber-dark"
                      onClick={handleRetryLoad}
                      disabled={isSubmitting}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Recargar Formulario
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <TestResultForm
                  testIds={sample.testIds || []}
                  sampleId={sample.id}
                  onSubmit={handleResultsSubmit}
                  existingResults={testResults}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResultsCard;
