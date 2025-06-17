import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, PackageCheck, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLots } from '@/hooks/useLots';
import { useAuth } from '@/context/AuthContext';
import { formatDate, getLatestTestResultsByParameter } from '@/components/lots/details/LotDetailsUtils';
import LotDetailsHeader from '@/components/lots/details/LotDetailsHeader';
import BasicInfoCard from '@/components/lots/details/BasicInfoCard';
import TestResultsDisplay from '@/components/lots/details/TestResultsDisplay';
import LotPhotosUpload from '@/components/lots/details/LotPhotosUpload';
import LotQRCode from '@/components/lots/details/LotQRCode';
import LotOriginCard from '@/components/lots/details/LotOriginCard';
import LotClassificationCard from '@/components/lots/details/LotClassificationCard';
import LabelStatusCard from '@/components/lots/details/LabelStatusCard';
import TestResultsHistoryCard from '@/components/lots/details/TestResultsHistoryCard';
import { toast } from '@/hooks/use-toast';
import ParameterEvolutionChart from '@/components/lots/details/ParameterEvolutionChart';
import { useLotLabels } from '@/hooks/useLotLabels';
import { getEffectiveLotLabel } from '@/utils/lotStatusUtils';

const LotDetails = () => {
  const { lotCode, id } = useParams<{ lotCode?: string; id?: string }>();
  const { user } = useAuth();
  const { getLotByCode } = useLots();
  const { labels } = useLotLabels();
  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const isMounted = useRef(true);

  // Use lotCode from params, fallback to id if needed
  const actualLotCode = lotCode || id;

  useEffect(() => {
    console.log('LotDetails render, role:', user?.role);
    console.log('LotDetails params - lotCode:', lotCode, 'id:', id);
    isMounted.current = true;

    const fetchLot = async () => {
      if (!actualLotCode) {
        setError('No lot code provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Fetching lot data for code: ${actualLotCode} (attempt ${retryCount + 1})`);
        
        // Try to get lot by ID first if actualLotCode looks like a UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(actualLotCode);
        
        let lotData;
        if (isUUID) {
          // If it's a UUID, try to fetch by ID first
          console.log('Attempting to fetch by ID (UUID detected)');
          try {
            lotData = await getLotByCode(actualLotCode);
          } catch (err) {
            console.log('Failed to fetch by ID, will try by code');
          }
        }
        
        if (!lotData) {
          lotData = await getLotByCode(actualLotCode);
        }
        
        console.log('Fetched lot data:', lotData);
        
        if (isMounted.current) {
          if (!lotData || Object.keys(lotData).length === 0) {
            if (retryCount < maxRetries) {
              console.log(`Lot data not found, retrying... (${retryCount + 1}/${maxRetries})`);
              setRetryCount(prev => prev + 1);
              return;
            } else {
              setError('No se pudo cargar el lote después de varios intentos');
            }
          } else {
            setLot(lotData);
            setError(null);
            
            // Enhanced logging for sample test results and parameters
            if (lotData.samples && lotData.samples.length > 0) {
              console.log('Sample details analysis:');
              lotData.samples.forEach((sample, index) => {
                console.log(`Sample ${index + 1}:`, {
                  id: sample.id,
                  status: sample.status,
                  testIds: sample.testIds,
                  testIdsType: typeof sample.testIds,
                  testIdsLength: sample.testIds?.length,
                  createdAt: sample.createdAt,
                  testResults: sample.test_results?.map(tr => ({
                    parameterId: tr.parameterId,
                    value: tr.value,
                    createdAt: tr.createdAt
                  })) || []
                });
              });
              
              const latestResults = getLatestTestResultsByParameter(lotData.samples);
              console.log('Latest test results by parameter:', Array.from(latestResults.entries()));
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching lot:', err);
        if (isMounted.current) {
          setError(err.message || 'No se pudo cargar el lote');
          
          if (retryCount < maxRetries) {
            console.log(`Error loading lot, retrying... (${retryCount + 1}/${maxRetries})`);
            setRetryCount(prev => prev + 1);
            return;
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchLot();

    return () => {
      isMounted.current = false;
    };
  }, [actualLotCode, getLotByCode, retryCount]);

  const refreshLotData = async () => {
    console.log('Refreshing lot data...');
    try {
      const lotData = await getLotByCode(actualLotCode!);
      console.log('Refreshed lot data:', lotData);
      setLot(lotData);
    } catch (err: any) {
      console.error('Error refreshing lot data:', err);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    toast({
      title: "Reintentando",
      description: "Intentando cargar los datos nuevamente...",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100/30 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-navy-200/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p className="text-navy-700 font-medium">Cargando detalles del lote...</p>
        </div>
      </div>
    );
  }

  if (error || !lot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100/30 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-xl border border-navy-200/50">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy-800 mb-2">
              Lote no encontrado
            </h2>
            <p className="text-navy-600 mb-4">
              {error || 'No se pudo encontrar el lote solicitado'}
            </p>
            <div className="space-x-4">
              <Button onClick={() => window.history.back()} className="bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-800 hover:to-navy-900">
                Volver
              </Button>
              <Button variant="outline" onClick={handleRetry} className="border-navy-300 text-navy-700 hover:bg-navy-50">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestTestResults = getLatestTestResultsByParameter(lot.samples);
  
  // Get the effective label using the lot label system
  const effectiveLabel = getEffectiveLotLabel(lot, labels || []);
  const effectiveLabelName = effectiveLabel?.name || 'No analizado';
  
  // Create status config based on effective label
  const getIconComponent = (labelName: string) => {
    switch (labelName.toLowerCase()) {
      case 'superior':
        return CheckCircle;
      case 'standard':
        return PackageCheck;
      case 'retenido':
        return AlertTriangle;
      default:
        return HelpCircle;
    }
  };

  const statusConfig = {
    label: effectiveLabelName,
    icon: getIconComponent(effectiveLabelName),
    variant: effectiveLabelName.toLowerCase() === 'superior' ? 'default' as const : 
             effectiveLabelName.toLowerCase() === 'standard' ? 'secondary' as const :
             effectiveLabelName.toLowerCase() === 'retenido' ? 'destructive' as const : 'outline' as const,
    color: effectiveLabelName.toLowerCase() === 'superior' ? 'text-green-600' :
           effectiveLabelName.toLowerCase() === 'standard' ? 'text-blue-600' :
           effectiveLabelName.toLowerCase() === 'retenido' ? 'text-red-600' : 'text-gray-600'
  };

  // Get sample IDs that have test results for parameter labels
  const sampleIds = lot.samples
    ?.filter((sample: any) => sample.test_results && sample.test_results.length > 0)
    ?.map((sample: any) => sample.id) || [];

  console.log('🎯 LotDetails - Sample IDs with test results:', sampleIds);
  console.log('🧪 LotDetails - Latest test results:', Array.from(latestTestResults.values()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100/30">
      <LotDetailsHeader lot={lot} statusConfig={statusConfig} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Enhanced Layout with Rich Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BasicInfoCard lot={lot} formatDate={formatDate} />
            <LotOriginCard currentLot={lot} />
          </div>

          <LotClassificationCard 
            category={lot.category}
            lotType={lot.lotType}
            plant={lot.plant}
            campaign={lot.campaign}
            unit={lot.unit}
            amount={lot.amount}
          />

          {/* Enhanced Label and Status Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LabelStatusCard lot={lot} formatDate={formatDate} />
            <TestResultsHistoryCard samples={lot.samples || []} formatDate={formatDate} />
          </div>
          
          <TestResultsDisplay 
            testResults={Array.from(latestTestResults.values())} 
            sampleIds={sampleIds}
            formatDate={formatDate}
            onResultsSaved={refreshLotData}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LotPhotosUpload
              lotId={lot.id}
              lotCode={lot.code}
              photos={lot.media || []}
              onPhotosUpdate={refreshLotData}
            />
            <LotQRCode lotCode={lot.code} qrUrl={lot.qrUrl} />
          </div>
          
          {lot.samples && lot.samples.length > 0 && (
            <ParameterEvolutionChart 
              samples={lot.samples} 
              formatDate={formatDate} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LotDetails;
