
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, PackageCheck, AlertTriangle, HelpCircle, ArrowLeft, Shield, Leaf, Calendar, Award, BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, getLatestTestResultsByParameter } from '@/components/lots/details/LotDetailsUtils';
import SecurePublicAccess from '@/components/security/SecurePublicAccess';
import { useLotLabels } from '@/hooks/useLotLabels';
import { getEffectiveLotLabel } from '@/utils/lotStatusUtils';

const PublicLotDetails = () => {
  const { lotCode, id } = useParams<{ lotCode?: string; id?: string }>();
  const navigate = useNavigate();
  const { labels } = useLotLabels();

  const actualLotCode = lotCode || id;

  const handleBack = () => {
    navigate('/lot-lookup');
  };

  const getQualityLevel = (lot: any) => {
    const effectiveLabel = getEffectiveLotLabel(lot, labels || []);
    const labelName = effectiveLabel?.name || 'No analizado';
    
    switch (labelName.toLowerCase()) {
      case 'superior':
        return {
          level: 'Superior',
          description: 'Calidad excepcional - Supera estándares de la industria',
          color: 'from-emerald-500 to-emerald-600',
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50',
          icon: Award,
        };
      case 'standard':
        return {
          level: 'Estándar',
          description: 'Calidad certificada - Cumple estándares oficiales',
          color: 'from-blue-500 to-blue-600',
          textColor: 'text-blue-800',
          bgColor: 'bg-blue-50',
          icon: CheckCircle,
        };
      case 'pgo':
        return {
          level: 'PGO Certificado',
          description: 'Producto de alta calidad con certificación especial',
          color: 'from-purple-500 to-purple-600',
          textColor: 'text-purple-800',
          bgColor: 'bg-purple-50',
          icon: Shield,
        };
      default:
        return {
          level: 'En Evaluación',
          description: 'Análisis en proceso - Resultados próximamente',
          color: 'from-gray-500 to-gray-600',
          textColor: 'text-gray-800',
          bgColor: 'bg-gray-50',
          icon: HelpCircle,
        };
    }
  };

  if (!actualLotCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto bg-white/90 backdrop-blur-sm shadow-xl border border-green-200/50">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Código requerido
            </h2>
            <p className="text-gray-600 mb-6">
              No se proporcionó código de lote para consultar
            </p>
            <Button onClick={handleBack} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Búsqueda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SecurePublicAccess lotCode={actualLotCode}>
      {(lot) => {
        const latestTestResults = getLatestTestResultsByParameter(lot.samples || []);
        const qualityInfo = getQualityLevel(lot);
        const QualityIcon = qualityInfo.icon;

        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative max-w-6xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                  <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    className="text-white hover:bg-white/10 rounded-xl"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Volver a Búsqueda</span>
                  </Button>
                  <div className="flex items-center space-x-2 text-white/90">
                    <Eye className="h-5 w-5" />
                    <span className="text-sm font-medium">Consulta Pública Verificada</span>
                  </div>
                </div>
                
                <div className="text-center text-white">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${qualityInfo.color} flex items-center justify-center shadow-lg`}>
                      <QualityIcon className="h-10 w-10 text-white drop-shadow-sm" />
                    </div>
                    <div className="text-left">
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        Lote {lot.code}
                      </h1>
                      <p className="text-xl text-green-100">
                        {lot.variety?.name} • {lot.variety?.crop?.name}
                      </p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-6 py-3 rounded-2xl ${qualityInfo.bgColor} ${qualityInfo.textColor} shadow-lg`}>
                    <QualityIcon className="h-5 w-5 mr-2" />
                    <span className="font-semibold text-lg">{qualityInfo.level}</span>
                  </div>
                  <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
                    {qualityInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-green-200/50 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Cultivo</h3>
                    <p className="text-xl font-bold text-gray-900">
                      {lot.variety?.crop?.name || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-green-200/50 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <PackageCheck className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Variedad</h3>
                    <p className="text-xl font-bold text-gray-900">
                      {lot.variety?.name || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-green-200/50 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Producción</h3>
                    <p className="text-lg font-bold text-gray-900">
                      {lot.created_at ? formatDate(lot.created_at) : 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-green-200/50 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Análisis</h3>
                    <p className="text-lg font-bold text-gray-900">
                      {latestTestResults.size} parámetro{latestTestResults.size !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quality Analysis Results */}
              {latestTestResults.size > 0 && (
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-green-200/50">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Análisis de Calidad</h3>
                        <p className="text-gray-600">Resultados de laboratorio certificado</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from(latestTestResults.values()).map((result) => (
                        <div 
                          key={`${result.parameterId}-${result.sampleId}`}
                          className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-shadow"
                        >
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              {result.parameter?.name || 'Parámetro'}
                            </h4>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {result.value}
                            </div>
                            <div className="text-sm text-gray-500">
                              Análisis: {result.createdAt ? formatDate(result.createdAt) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trust & Transparency */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-800">Garantía de Calidad</h3>
                        <p className="text-emerald-600">Certificación y trazabilidad completa</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-emerald-700">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                        Análisis en laboratorio certificado
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                        Trazabilidad desde la producción
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                        Cumplimiento de normativas vigentes
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                        Transparencia total en resultados
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                        <Leaf className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">Para su Tranquilidad</h3>
                        <p className="text-blue-600">Información que puede confiar</p>
                      </div>
                    </div>
                    <div className="space-y-4 text-blue-700">
                      <div className="bg-white/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Origen Verificado</h4>
                        <p className="text-sm">Cada lote tiene documentación completa de su origen y proceso de producción.</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Análisis Independiente</h4>
                        <p className="text-sm">Los análisis son realizados por laboratorios certificados independientes.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">¿Interesado en este lote?</h3>
                  <p className="text-lg text-green-100 mb-6 max-w-2xl mx-auto">
                    Contacte a nuestro equipo comercial para más información sobre disponibilidad, 
                    precios y condiciones de entrega.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Badge className="bg-white text-green-600 px-4 py-2 text-base font-medium">
                      Lote Verificado: {lot.code}
                    </Badge>
                    <Badge className="bg-green-500 text-white px-4 py-2 text-base font-medium">
                      Calidad: {qualityInfo.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-2">
                  Sistema de Gestión de Calidad de Semillas
                </p>
                <p className="text-gray-400 text-xs">
                  © 2025 SeedQuality - Transparencia y calidad en cada semilla
                </p>
              </div>
            </div>
          </div>
        );
      }}
    </SecurePublicAccess>
  );
};

export default PublicLotDetails;
