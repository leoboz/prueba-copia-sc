
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestTube, Calendar, TrendingUp, Clock } from 'lucide-react';
import { Sample, TestResult } from '@/types';

interface TestResultsHistoryCardProps {
  samples: Sample[];
  formatDate: (date: string) => string;
}

const TestResultsHistoryCard: React.FC<TestResultsHistoryCardProps> = ({ samples, formatDate }) => {
  // Sort samples by creation date (newest first)
  const sortedSamples = [...samples].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Group test results by parameter name across all samples
  const parameterTimeline = new Map<string, Array<{
    sample: Sample;
    result: TestResult & { parameter?: { name: string } };
    sampleIndex: number;
  }>>();

  sortedSamples.forEach((sample, index) => {
    if (sample.test_results && sample.test_results.length > 0) {
      sample.test_results.forEach((result) => {
        const parameterName = result.parameter?.name || 'Parámetro Desconocido';
        
        if (!parameterTimeline.has(parameterName)) {
          parameterTimeline.set(parameterName, []);
        }
        
        parameterTimeline.get(parameterName)!.push({
          sample,
          result,
          sampleIndex: index + 1
        });
      });
    }
  });

  // Sort timeline entries by date (newest first)
  parameterTimeline.forEach((entries) => {
    entries.sort((a, b) => 
      new Date(b.sample.createdAt).getTime() - new Date(a.sample.createdAt).getTime()
    );
  });

  const getLabelVariant = (label?: string) => {
    if (!label) return 'outline';
    const normalizedLabel = label.toLowerCase();
    if (normalizedLabel.includes('superior')) return 'default';
    if (normalizedLabel.includes('standard')) return 'secondary';
    if (normalizedLabel.includes('retenido')) return 'destructive';
    return 'outline';
  };

  const getLabelColor = (label?: string) => {
    if (!label) return 'text-gray-600';
    const normalizedLabel = label.toLowerCase();
    if (normalizedLabel.includes('superior')) return 'text-emerald-600';
    if (normalizedLabel.includes('standard')) return 'text-blue-600';
    if (normalizedLabel.includes('retenido')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-navy-200/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-navy-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-navy-600" />
          Historial de Análisis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {parameterTimeline.size === 0 ? (
          <div className="text-center py-8 text-navy-500">
            <TestTube className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay resultados de análisis registrados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(parameterTimeline.entries()).map(([parameterName, entries]) => (
              <div key={parameterName} className="relative">
                {/* Parameter Header */}
                <div className="sticky top-0 bg-gradient-to-r from-navy-50 to-navy-100/50 backdrop-blur-sm rounded-lg p-3 mb-4 border border-navy-200/30">
                  <h4 className="font-semibold text-navy-800 flex items-center gap-2">
                    <TestTube className="h-4 w-4 text-navy-600" />
                    {parameterName}
                    <Badge variant="outline" className="ml-auto text-xs">
                      {entries.length} resultado{entries.length !== 1 ? 's' : ''}
                    </Badge>
                  </h4>
                </div>

                {/* Timeline for this parameter */}
                <div className="relative pl-6">
                  {/* Timeline line */}
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-navy-300 to-navy-200"></div>

                  <div className="space-y-4">
                    {entries.map((entry, entryIndex) => (
                      <div key={`${entry.sample.id}-${entry.result.id}`} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-5 top-3 w-3 h-3 rounded-full bg-navy-500 border-2 border-white shadow-sm"></div>

                        {/* Timeline entry */}
                        <div className="bg-white rounded-lg border border-navy-200/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="font-medium text-navy-800 text-sm">
                                  Muestra #{entry.sampleIndex}
                                </span>
                                {entry.sample.internal_code && (
                                  <span className="text-xs text-navy-500 font-mono">
                                    {entry.sample.internal_code}
                                  </span>
                                )}
                              </div>
                              <Badge 
                                variant={entry.sample.status === 'completed' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {entry.sample.status === 'completed' ? 'Completado' : 
                                 entry.sample.status === 'testing' ? 'En análisis' :
                                 entry.sample.status === 'received' ? 'Recibido' : 'Enviado'}
                              </Badge>
                            </div>

                            {/* Result value and label */}
                            <div className="text-right">
                              <div className="text-xl font-bold text-navy-800 mb-1">
                                {entry.result.value}
                              </div>
                              {entry.result.label && (
                                <Badge 
                                  variant={getLabelVariant(entry.result.label)}
                                  className="text-xs"
                                >
                                  {entry.result.label}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Date information */}
                          <div className="flex items-center gap-4 text-xs text-navy-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(entry.sample.createdAt)}
                            </span>
                            {entry.sample.estimatedResultDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Est: {formatDate(entry.sample.estimatedResultDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResultsHistoryCard;
