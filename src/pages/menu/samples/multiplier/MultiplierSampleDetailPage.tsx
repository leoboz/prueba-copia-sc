
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSampleDetails } from '@/hooks/useSampleDetails';
import { useLots } from '@/hooks/useLots';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sample } from '@/types';
import { toast } from '@/hooks/use-toast';
import MultiplierSampleDetail from '@/components/samples/MultiplierSampleDetail';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';

const MultiplierSampleDetailPage: React.FC = () => {
  const { sampleId } = useParams<{ sampleId: string }>();
  const { getSampleById } = useSampleDetails();
  const { lots, isLoading: lotsLoading } = useLots();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sample, setSample] = useState<Sample | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchSample = useCallback(async () => {
    if (!sampleId || !user || !lots || lotsLoading || hasFetched) return;
    
    console.log(`🔄 Starting sample fetch for ID: ${sampleId}`);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`📡 Fetching sample with ID: ${sampleId}`);
      const sampleData = await getSampleById(sampleId);
      console.log('✅ Fetched sample data:', sampleData);
      
      // For multiplier users, check if they own the lot and sample is completed
      const sampleLot = lots.find(lot => lot.id === sampleData.lotId);
      const isLotOwner = sampleLot?.userId === user.id;
      const isCompleted = sampleData.status === 'completed';
      
      if (!isLotOwner) {
        console.log('❌ Access denied: User does not own the lot');
        setError('No tiene permisos para ver esta muestra.');
        return;
      }
      
      if (!isCompleted) {
        console.log('❌ Access denied: Sample not completed');
        setError('Esta muestra aún no ha sido completada por el laboratorio.');
        return;
      }
      
      setSample(sampleData);
      console.log('✅ Sample data set successfully');
    } catch (error: any) {
      console.error(`💥 Error fetching sample:`, error);
      setError('No se pudo cargar la muestra solicitada.');
      toast({
        title: "Error",
        description: "No se pudo cargar la muestra solicitada.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setHasFetched(true);
      console.log('🏁 Sample fetch completed');
    }
  }, [sampleId, user?.id, getSampleById, lots, lotsLoading, hasFetched]);

  useEffect(() => {
    console.log('🔍 useEffect triggered with dependencies:', {
      sampleId,
      userId: user?.id,
      lotsCount: lots?.length,
      lotsLoading,
      hasFetched
    });
    
    if (sampleId && user && lots && !lotsLoading && !hasFetched) {
      console.log('✅ All conditions met, triggering fetchSample');
      fetchSample();
    }
  }, [sampleId, user?.id, lots?.length, lotsLoading, hasFetched, fetchSample]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 flex items-center justify-center p-6">
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl border-navy-200/40">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-100 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-navy-600 animate-spin" />
          </div>
          <p className="text-navy-700 font-medium">Cargando autenticación...</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 flex items-center justify-center p-6">
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl border-navy-200/40">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-100 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-navy-600 animate-spin" />
          </div>
          <p className="text-navy-700 font-medium text-lg">Cargando detalles de la muestra...</p>
          <p className="text-navy-500 text-sm mt-2">Verificando permisos y estado...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl border-navy-200/40">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-serif text-navy-900 mb-2">Acceso Denegado</h2>
            <p className="text-navy-600 text-lg mb-6">{error}</p>
            <Button 
              onClick={() => navigate('/samples')}
              className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white shadow-lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Muestras
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl border-navy-200/40">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-xl font-serif text-navy-900 mb-2">Muestra No Encontrada</h2>
            <p className="text-navy-600 text-lg mb-6">La muestra solicitada no existe o no está disponible.</p>
            <Button 
              onClick={() => navigate('/samples')}
              className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white shadow-lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Muestras
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif text-navy-900 font-bold">Resultados de la Muestra</h1>
            <p className="text-navy-600 mt-2">Análisis completado para el lote {sample.lot?.code}</p>
          </div>
          <Button 
            onClick={() => navigate('/samples')}
            variant="outline"
            className="border-navy-200 text-navy-600 hover:bg-navy-50 hover:border-navy-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Muestras
          </Button>
        </div>

        {/* Sample Details */}
        <MultiplierSampleDetail sample={sample} />
      </div>
    </div>
  );
};

export default MultiplierSampleDetailPage;
