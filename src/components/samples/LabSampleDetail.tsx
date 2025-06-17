
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sample } from '@/types';
import { useTestResults } from '@/hooks/useTestResults';
import { useSampleStatuses } from '@/hooks/useSampleStatuses';
import { useSampleLabels } from '@/hooks/useSampleLabels';
import { toast } from '@/hooks/use-toast';
import SampleDetailHeader from './SampleDetailHeader';
import SampleInfoDisplay from './SampleInfoDisplay';
import StatusActions from './StatusActions';
import TestResultsCard from './TestResultsCard';
import LabelDebugger from './LabelDebugger';
import DebugInfo from './DebugInfo';

interface LabSampleDetailProps {
  sample: Sample;
  onStatusUpdate?: (sampleId: string, status: string, estimatedResultDate?: string) => Promise<void>;
}

const LabSampleDetail: React.FC<LabSampleDetailProps> = ({ sample, onStatusUpdate }) => {
  const { getSampleResults, saveTestResults } = useTestResults();
  const { statuses } = useSampleStatuses();
  const { labels } = useSampleLabels();
  
  console.log('LabSampleDetail rendering with sample:', sample);

  useEffect(() => {
    const fetchResults = async () => {
      if (sample.status === 'completed') {
        const results = await getSampleResults(sample.id);
        console.log('Lab sample results:', results);
      }
    };
    fetchResults();
  }, [sample.id, sample.status, getSampleResults]);

  const getStatusDisplay = (status: string) => {
    const statusRecord = statuses?.find(s => s.name === status);
    return statusRecord?.description || status;
  };

  const getLabelDisplay = (labelId?: string) => {
    if (!labelId || !labels) return 'Ninguna';
    const labelRecord = labels.find(l => l.id === labelId);
    return labelRecord?.name || 'Ninguna';
  };

  const handleStatusUpdate = async (sampleId: string, status: string, estimatedResultDate?: string) => {
    try {
      await onStatusUpdate?.(sampleId, status, estimatedResultDate);
      toast({
        title: "Estado actualizado",
        description: `La muestra ha sido actualizada a: ${getStatusDisplay(status)}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la muestra.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <SampleDetailHeader status={sample.status} />
        <CardContent>
          <SampleInfoDisplay sample={sample} userRole="lab" />
          {sample.labelId && (
            <p className="text-countryside-brown-dark mt-2">
              <strong>Etiqueta Combinada:</strong> {getLabelDisplay(sample.labelId)}
            </p>
          )}
          <StatusActions 
            sample={sample} 
            userRole="lab" 
            onStatusUpdate={handleStatusUpdate} 
          />
        </CardContent>
      </Card>
      
      {process.env.NODE_ENV !== 'production' && (
        <>
          <DebugInfo
            user={null} 
            sample={sample}
            userRole="lab" 
            hasPermission={true} 
          />
          <LabelDebugger sampleId={sample.id} />
        </>
      )}
      
      <TestResultsCard
        sample={sample}
        userRole="lab"
        getSampleResults={getSampleResults}
        saveTestResults={saveTestResults}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default LabSampleDetail;
