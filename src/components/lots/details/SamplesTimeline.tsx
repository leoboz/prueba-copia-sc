
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle, Beaker, History } from 'lucide-react';
import { SampleWithTestResults } from '@/types/lot-lookup';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { useSampleLabels } from '@/hooks/useSampleLabels';

interface SamplesTimelineProps {
  samples: SampleWithTestResults[];
  formatDate: (dateString: string | undefined) => string;
}

const getSampleStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'testing':
      return <Beaker className="h-4 w-4 text-amber-500" />;
    case 'received':
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getSampleStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'testing':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'received':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getLabelColor = (label: string | null | undefined) => {
  if (!label) return 'bg-gray-100 text-gray-800';
  
  switch (label.toLowerCase()) {
    case 'superior':
      return 'bg-emerald-100 text-emerald-800';
    case 'standard':
      return 'bg-blue-100 text-blue-800';
    case 'retenido':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const SamplesTimeline: React.FC<SamplesTimelineProps> = ({ samples, formatDate }) => {
  // Get sample labels to translate labelId to label name
  const { labels, isLoading: labelsLoading } = useSampleLabels();
  
  // Sort samples by creation date, newest first
  const sortedSamples = [...samples].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Function to get label name from labelId
  const getLabelName = (labelId: string | null | undefined) => {
    if (!labelId || !labels) return null;
    const foundLabel = labels.find(l => l.id === labelId);
    return foundLabel?.name || null;
  };

  if (samples.length === 0) {
    return (
      <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
          <CardTitle className="flex items-center text-xl font-serif">
            <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
            <History className="h-6 w-6 mr-3" />
            Línea de Tiempo de Muestras
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-navy-100 to-navy-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-navy-400" />
            </div>
            <p className="text-navy-600 font-medium">
              Este lote aún no tiene muestras registradas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <CardTitle className="flex items-center text-xl font-serif">
          <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
          <History className="h-6 w-6 mr-3" />
          Línea de Tiempo de Muestras
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="overflow-hidden rounded-xl border border-navy-200/40 bg-white shadow-inner">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-navy-50 to-navy-100/50 border-b border-navy-200/40">
                <TableHead className="font-semibold text-navy-800">Fecha</TableHead>
                <TableHead className="font-semibold text-navy-800">Estado</TableHead>
                <TableHead className="font-semibold text-navy-800">Etiqueta</TableHead>
                <TableHead className="font-semibold text-navy-800">Resultados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSamples.map((sample, index) => {
                const labelName = getLabelName(sample.labelId);
                return (
                  <TableRow 
                    key={sample.id} 
                    className={`hover:bg-navy-50/50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-navy-25/30'
                    }`}
                  >
                    <TableCell className="font-medium text-navy-700">
                      {formatDate(sample.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSampleStatusIcon(sample.status)}
                        <Badge className={`${getSampleStatusColor(sample.status)} shadow-sm`}>
                          {sample.status === 'completed' ? 'Completado' : 
                           sample.status === 'testing' ? 'En análisis' : 
                           sample.status === 'received' ? 'Recibido' : 'Enviado'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {labelName ? (
                        <Badge className={`${getLabelColor(labelName)} shadow-sm`}>
                          {labelName}
                        </Badge>
                      ) : (
                        <span className="text-navy-500 text-sm font-medium">Sin etiqueta</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {sample.test_results && sample.test_results.length > 0 ? (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                          <span className="text-navy-700 font-medium text-sm">
                            {sample.test_results.length} resultados
                          </span>
                        </div>
                      ) : (
                        <span className="text-navy-500 text-sm font-medium">Sin resultados</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SamplesTimeline;
