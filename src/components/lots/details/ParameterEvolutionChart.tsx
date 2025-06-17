
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, History } from 'lucide-react';
import { SampleWithTestResults } from '@/types/lot-lookup';
import { Badge } from '@/components/ui/badge';
import { useSampleLabels } from '@/hooks/useSampleLabels';
import { startOfWeek, format } from 'date-fns';

interface ParameterEvolutionChartProps {
  samples: SampleWithTestResults[];
  formatDate: (dateString: string | undefined) => string;
}

const ParameterEvolutionChart: React.FC<ParameterEvolutionChartProps> = ({ samples, formatDate }) => {
  const { labels } = useSampleLabels();

  const chartData = useMemo(() => {
    // Group test results by parameter and week
    const parameterGroups: Record<string, Record<string, { values: number[], weekStart: Date, count: number, average?: number }>> = {};
    const parameterNames: Record<string, string> = {};
    
    samples.forEach(sample => {
      if (sample.test_results) {
        sample.test_results.forEach(result => {
          if (result.parameter && result.parameterId) {
            const parameterId = result.parameterId;
            parameterNames[parameterId] = result.parameter.name;
            
            if (!parameterGroups[parameterId]) {
              parameterGroups[parameterId] = {};
            }
            
            // Convert value to number, handling different types
            let numericValue = 0;
            if (typeof result.value === 'number') {
              numericValue = result.value;
            } else if (typeof result.value === 'string') {
              numericValue = parseFloat(result.value) || 0;
            } else if (typeof result.value === 'boolean') {
              numericValue = result.value ? 1 : 0;
            }
            
            // Get week start for grouping
            const sampleDate = new Date(sample.createdAt);
            const weekStart = startOfWeek(sampleDate, { weekStartsOn: 1 }); // Monday start
            const weekKey = format(weekStart, 'yyyy-MM-dd');
            
            if (!parameterGroups[parameterId][weekKey]) {
              parameterGroups[parameterId][weekKey] = {
                values: [],
                weekStart,
                count: 0
              };
            }
            
            parameterGroups[parameterId][weekKey].values.push(numericValue);
            parameterGroups[parameterId][weekKey].count++;
          }
        });
      }
    });

    // Calculate averages for each week and parameter
    Object.keys(parameterGroups).forEach(parameterId => {
      Object.keys(parameterGroups[parameterId]).forEach(weekKey => {
        const weekData = parameterGroups[parameterId][weekKey];
        const average = weekData.values.reduce((sum, val) => sum + val, 0) / weekData.values.length;
        parameterGroups[parameterId][weekKey].average = average;
      });
    });

    // Create chart data points
    const allWeeks = new Set<string>();
    Object.keys(parameterGroups).forEach(parameterId => {
      Object.keys(parameterGroups[parameterId]).forEach(weekKey => {
        allWeeks.add(weekKey);
      });
    });
    
    const sortedWeeks = Array.from(allWeeks).sort();
    
    return sortedWeeks.map(weekKey => {
      const dataPoint: any = {
        week: format(new Date(weekKey), 'dd/MM'),
        fullDate: format(new Date(weekKey), 'dd/MM/yyyy'),
        weekStart: weekKey
      };
      
      Object.keys(parameterGroups).forEach(parameterId => {
        const parameterName = parameterNames[parameterId];
        const weekData = parameterGroups[parameterId][weekKey];
        
        if (weekData && weekData.average !== undefined) {
          dataPoint[parameterName] = Number(weekData.average.toFixed(2));
          dataPoint[`${parameterName}_count`] = weekData.count;
        }
      });
      
      return dataPoint;
    });
  }, [samples]);

  const parameters = useMemo(() => {
    const paramSet = new Set();
    samples.forEach(sample => {
      if (sample.test_results) {
        sample.test_results.forEach(result => {
          if (result.parameter?.name) {
            paramSet.add(result.parameter.name);
          }
        });
      }
    });
    return Array.from(paramSet) as string[];
  }, [samples]);

  const colors = ['#002738', '#1e40af', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#be123c'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 p-4 rounded-lg border border-navy-200/40 shadow-lg">
          <p className="font-semibold text-navy-800 mb-2">
            Semana del {data.fullDate}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-navy-700">{entry.dataKey}:</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-navy-800">{entry.value}</span>
                {data[`${entry.dataKey}_count`] && (
                  <span className="text-xs text-navy-500 ml-1">
                    ({data[`${entry.dataKey}_count`]} muestra{data[`${entry.dataKey}_count`] !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (samples.length === 0) {
    return (
      <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
          <CardTitle className="flex items-center text-xl font-serif">
            <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
            <TrendingUp className="h-6 w-6 mr-3" />
            Evolución de Parámetros
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-navy-100 to-navy-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-navy-400" />
            </div>
            <p className="text-navy-600 font-medium">
              Este lote aún no tiene datos de evolución de parámetros.
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
          <TrendingUp className="h-6 w-6 mr-3" />
          Evolución de Parámetros por Semana
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
            {parameters.length} parámetro{parameters.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-96 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#002738" opacity={0.1} />
              <XAxis 
                dataKey="week" 
                stroke="#002738"
                fontSize={12}
                tick={{ fill: '#002738' }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                stroke="#002738"
                fontSize={12}
                tick={{ fill: '#002738' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {parameters.map((parameter, index) => (
                <Line
                  key={parameter}
                  type="monotone"
                  dataKey={parameter}
                  stroke={colors[index % colors.length]}
                  strokeWidth={3}
                  dot={{ 
                    fill: colors[index % colors.length], 
                    strokeWidth: 2, 
                    r: 5,
                    stroke: '#fff'
                  }}
                  activeDot={{ 
                    r: 7, 
                    stroke: colors[index % colors.length], 
                    strokeWidth: 2,
                    fill: '#fff'
                  }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary */}
        <div className="pt-4 border-t border-navy-200/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-navy-500">Total Muestras</p>
              <p className="text-lg font-bold text-navy-800">{samples.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-navy-500">Parámetros</p>
              <p className="text-lg font-bold text-navy-800">{parameters.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-navy-500">Semanas de Datos</p>
              <p className="text-lg font-bold text-navy-800">{chartData.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-navy-500">Última Actualización</p>
              <p className="text-lg font-bold text-navy-800">
                {samples.length > 0 ? formatDate(samples[0].createdAt) : '-'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterEvolutionChart;
