
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSampleDetails } from '@/hooks/useSampleDetails';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sample } from '@/types';
import { toast } from '@/hooks/use-toast';
import LabSampleDetail from '@/components/samples/LabSampleDetail';
import { ArrowLeft, FlaskConical } from 'lucide-react';

const LabSampleDetailPage: React.FC = () => {
  const { sampleId } = useParams<{ sampleId: string }>();
  const { getSampleById, updateSampleStatus } = useSampleDetails();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sample, setSample] = useState<Sample | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  const fetchSample = useCallback(async () => {
    if (!sampleId || !user || fetchAttempted) return;
    
    setIsLoading(true);
    setError(null);
    setFetchAttempted(true);
    
    try {
      console.log(`Lab fetching sample with ID: ${sampleId}`);
      const sampleData = await getSampleById(sampleId);
      console.log('Lab fetched sample data:', sampleData);
      
      if (sampleData.userId !== user.id) {
        setError('No tiene permisos para ver esta muestra.');
        setIsLoading(false);
        return;
      }
      
      setSample(sampleData);
      setIsLoading(false);
    } catch (error: any) {
      console.error(`Error fetching sample:`, error);
      setError('No se pudo cargar la muestra solicitada.');
      toast({
        title: "Error",
        description: "No se pudo cargar la muestra solicitada.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [sampleId, user?.id, getSampleById, fetchAttempted]);

  useEffect(() => {
    if (sampleId && user && !fetchAttempted) {
      fetchSample();
    }
  }, [sampleId, user?.id, fetchSample, fetchAttempted]);

  const handleStatusUpdate = async (
    sampleId: string,
    status: Sample['status'],
    estimatedResultDate?: string
  ) => {
    try {
      console.log('Lab updating sample status:', { sampleId, status, estimatedResultDate });
      const updatedSample = await updateSampleStatus.mutateAsync({
        sampleId,
        status,
        estimatedResultDate
      });
      setSample(updatedSample);
      toast({
        title: "Estado actualizado",
        description: `La muestra ha sido actualizada a: ${
          status === 'submitted' ? 'Enviado' :
          status === 'received' ? 'Recibido' :
          status === 'confirmed' ? 'Confirmado' :
          status === 'testing' ? 'En Análisis' :
          status === 'completed' ? 'Completado' : status
        }`,
      });
      if (status === 'completed') {
        // Reset fetch attempted to allow refresh for completed samples
        setFetchAttempted(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la muestra.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl">
            <FlaskConical className="h-12 w-12 text-navy-600 mx-auto mb-4" />
            <p className="text-navy-700 text-lg">Cargando autenticación...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-navy-600 border-t-transparent"></div>
              <span className="ml-4 text-navy-700 text-lg">Cargando detalles de la muestra...</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="text-red-500 mb-4">
              <FlaskConical className="h-12 w-12 mx-auto mb-4" />
            </div>
            <p className="text-navy-700 text-lg mb-4">{error}</p>
            <Button 
              onClick={() => navigate('/samples')}
              className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700 text-white"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl">
            <FlaskConical className="h-12 w-12 text-navy-600 mx-auto mb-4" />
            <p className="text-navy-700 text-lg mb-4">Muestra no encontrada</p>
            <Button 
              onClick={() => navigate('/samples')}
              className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700 text-white"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/samples')}
            variant="outline"
            className="mb-4 border-navy-200 text-navy-700 hover:bg-navy-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Muestras
          </Button>
          <div className="bg-gradient-to-r from-navy-800 to-blue-700 rounded-xl p-6 text-white shadow-xl">
            <h1 className="text-3xl font-bold flex items-center">
              <FlaskConical className="mr-3 h-8 w-8" />
              Detalles de la Muestra - Laboratorio
            </h1>
            <p className="text-blue-100 mt-2">Código: {sample.lot?.code || 'N/A'}</p>
          </div>
        </div>
        
        <LabSampleDetail
          sample={sample}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default LabSampleDetailPage;
