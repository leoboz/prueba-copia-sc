
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sample } from '@/types';
import { useTestResults } from '@/hooks/useTestResults';
import { Calendar, TestTube, CheckCircle, Award, AlertTriangle, TrendingUp } from 'lucide-react';

interface MultiplierSampleDetailProps {
  sample: Sample;
}

const MultiplierSampleDetail: React.FC<MultiplierSampleDetailProps> = ({ sample }) => {
  const { getSampleResults } = useTestResults();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  console.log('🧪 MultiplierSampleDetail rendering with sample:', sample.id);

  useEffect(() => {
    const fetchResults = async () => {
      if (sample.status === 'completed' && !hasLoaded) {
        console.log('📊 Fetching test results for sample:', sample.id);
        try {
          const results = await getSampleResults(sample.id);
          console.log('✅ Multiplier sample results:', results);
          setTestResults(results);
        } catch (error) {
          console.error('💥 Error fetching test results:', error);
        } finally {
          setHasLoaded(true);
        }
      }
    };
    fetchResults();
  }, [sample.id, sample.status, getSampleResults, hasLoaded]);

  const getLabelConfig = (labelName?: string) => {
    if (!labelName) return {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: CheckCircle,
      iconColor: 'text-gray-600'
    };
    
    const normalizedLabel = labelName.toLowerCase();
    if (normalizedLabel.includes('superior')) {
      return {
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        icon: Award,
        iconColor: 'text-emerald-600'
      };
    } else if (normalizedLabel.includes('standard')) {
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        icon: CheckCircle,
        iconColor: 'text-blue-600'
      };
    } else if (normalizedLabel.includes('retenido')) {
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: AlertTriangle,
        iconColor: 'text-red-600'
      };
    } else {
      return {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: CheckCircle,
        iconColor: 'text-gray-600'
      };
    }
  };

  return (
    <div className="space-y-8">
      {/* Sample Information Card */}
      <Card className="overflow-hidden border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30">
        <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
          <CardTitle className="text-xl font-serif flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full"></div>
            <CheckCircle className="h-6 w-6" />
            Información de la Muestra
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-navy-600">Código de Lote:</p>
              <p className="text-lg font-semibold text-navy-900">{sample.lot?.code || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-navy-600">Código Interno:</p>
              <p className="text-lg font-semibold text-navy-900">{sample.internal_code || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-navy-600">Cultivo/Variedad:</p>
              <p className="text-lg font-semibold text-navy-900">
                {sample.lot?.variety?.crop?.name || 'N/A'} / {sample.lot?.variety?.name || 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-navy-600" />
                <p className="text-sm font-medium text-navy-600">Fecha de Análisis:</p>
              </div>
              <p className="text-lg font-semibold text-navy-900">
                {new Date(sample.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Card */}
      {testResults.length > 0 && (
        <Card className="overflow-hidden border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30">
          <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
            <CardTitle className="text-xl font-serif flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full"></div>
              <TrendingUp className="h-6 w-6" />
              Resultados de Análisis
              <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
                {testResults.length} parámetro{testResults.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-2">
              {testResults.map((result, index) => {
                const labelConfig = getLabelConfig(result.label);
                return (
                  <div 
                    key={index} 
                    className="group relative p-6 rounded-xl border border-navy-200/40 bg-gradient-to-br from-white to-navy-50/50 hover:shadow-lg transition-all duration-300 hover:border-navy-300/60 hover:bg-gradient-to-br hover:from-white hover:to-navy-100/60"
                  >
                    <div className="absolute top-4 right-4">
                      <labelConfig.icon className={`h-5 w-5 ${labelConfig.iconColor}`} />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-navy-800 group-hover:text-navy-900 transition-colors">
                          {result.parameter?.name || 'Parámetro Desconocido'}
                        </h3>
                        {result.parameter?.description && (
                          <p className="text-sm text-navy-600 mt-1">{result.parameter.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-navy-800">
                            {result.value}
                          </span>
                          {result.parameter?.type && (
                            <span className="text-sm text-navy-500 font-medium">
                              {result.parameter.type}
                            </span>
                          )}
                        </div>
                        
                        {result.label && (
                          <Badge className={`${labelConfig.bgColor} ${labelConfig.textColor} border-0 font-medium px-3 py-1 shadow-sm`}>
                            {result.label}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Progress indicator for numeric values */}
                      {typeof result.value === 'number' && result.parameter?.validation?.max && (
                        <div className="w-full bg-navy-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              result.label?.toLowerCase().includes('superior') ? 'bg-emerald-500' :
                              result.label?.toLowerCase().includes('standard') ? 'bg-blue-500' :
                              result.label?.toLowerCase().includes('retenido') ? 'bg-red-500' : 'bg-gray-500'
                            }`}
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
            <div className="mt-8 pt-6 border-t border-navy-200/30">
              <div className="flex items-center justify-between text-sm text-navy-600">
                <span className="font-medium">Total de parámetros evaluados</span>
                <span className="font-bold text-navy-800">{testResults.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiplierSampleDetail;
