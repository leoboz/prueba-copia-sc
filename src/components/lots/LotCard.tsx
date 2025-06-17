import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, Beaker, QrCode, Calendar, MapPin, Award, Eye, TestTube } from 'lucide-react';
import { Lot } from '@/types';
import QRCodeModal from './QRCodeModal';
import { useParameterLabels } from '@/hooks/useParameterLabels';
import { useLotLabels } from '@/hooks/useLotLabels';
import { getEffectiveLotLabel, getLotLabelColor } from '@/utils/lotStatusUtils';

interface LotCardProps {
  lot: Lot;
  labelInfo: { 
    combined: string;
    individual: { parameter: string; label: string }[] 
  };
  onCreateSample: (lotId: string) => void;
}

const LotCard: React.FC<LotCardProps> = ({ lot, labelInfo, onCreateSample }) => {
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { labels } = useLotLabels();

  console.log('DEBUG: useLotLabels in LotCard:', { labels });

  const sampleIds = lot.samples?.map(sample => sample.id) || [];
  const { data: parameterLabels, isLoading: labelsLoading } = useParameterLabels(sampleIds);

  const effectiveLabel = getEffectiveLotLabel(lot, labels || []);
  const effectiveLabelName = effectiveLabel?.name || 'No analizado';

  console.log('DEBUG: LotCard rendering for lot:', {
    lotId: lot.id,
    code: lot.code,
    calculatedLabelId: lot.calculatedLabelId,
    effectiveLabel,
    labels: labels?.map(l => ({ id: l.id, name: l.name })),
  });

  const getLabelBadgeClass = (label: string) => {
    switch(label.toLowerCase()) {
      case 'superior':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl';
      case 'standard':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl';
      case 'retenido':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl';
      case 'no analizado':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg hover:shadow-xl';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg hover:shadow-xl';
    }
  };

  const getLabelIcon = (label: string) => {
    switch(label.toLowerCase()) {
      case 'superior':
        return <Award className="h-3 w-3" />;
      case 'standard':
        return <Tag className="h-3 w-3" />;
      default:
        return <Tag className="h-3 w-3" />;
    }
  };
  
  return (
    <>
      <Card className="group overflow-hidden border-navy-200/40 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-navy-50/30 to-navy-100/20 hover:from-navy-50/50 hover:to-navy-100/40">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-5 p-6 bg-gradient-to-br from-white/90 to-navy-50/50">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center shadow-lg">
                      <Tag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-navy-900 group-hover:text-navy-700 transition-colors">
                        {lot.code}
                      </h3>
                      <p className="text-sm text-navy-600/70 font-medium">
                        Código de lote
                      </p>
                    </div>
                  </div>
                  <div className="ml-15">
                    <p className="text-navy-800 font-semibold text-lg">
                      {lot.variety?.crop?.name || 'Sin cultivo'} - {lot.variety?.name || 'Sin variedad'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getLabelBadgeClass(effectiveLabelName)} px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105`}>
                    {getLabelIcon(effectiveLabelName)}
                    <span className="ml-2">{effectiveLabelName}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 p-6 border-l border-r border-navy-200/30 bg-gradient-to-br from-navy-50/30 to-white/80">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-navy-600/70" />
                    <span className="text-navy-600/80 font-medium">Creado:</span>
                    <span className="font-semibold text-navy-800">
                      {new Date(lot.createdAt || '').toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-navy-600/70" />
                    <span className="text-navy-600/80 font-medium">Actualizado:</span>
                    <span className="font-semibold text-navy-800">
                      {new Date(lot.createdAt || '').toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                {!labelsLoading && parameterLabels && parameterLabels.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-navy-800 flex items-center gap-2">
                      <TestTube className="h-4 w-4" />
                      Parámetros analizados:
                    </p>
                    <div className="space-y-1">
                      {parameterLabels.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-navy-200/40 shadow-sm">
                          <span className="text-xs font-semibold text-navy-800">{item.parameter}</span>
                          <Badge className={`text-xs px-2 py-1 ${getLabelBadgeClass(item.label)} shadow-sm`}>
                            {item.label}
                          </Badge>
                        </div>
                      ))}
                      {parameterLabels.length > 3 && (
                        <p className="text-xs text-navy-600/70 text-center font-medium">
                          +{parameterLabels.length - 3} más...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-3 p-6 bg-gradient-to-br from-navy-100/30 to-navy-200/20">
              <div className="flex flex-col space-y-3 h-full justify-center">
                <Button 
                  variant="outline"
                  className="w-full border-navy-300/60 text-navy-800 hover:bg-navy-100 hover:border-navy-400 hover:text-navy-900 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                  onClick={() => navigate(`/lot-details/${encodeURIComponent(lot.code)}`)}
                >
                  <Eye className="mr-2 h-4 w-4" /> 
                  Ver Detalles
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-800 hover:to-navy-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                  onClick={() => onCreateSample(lot.id)}
                >
                  <Beaker className="mr-2 h-4 w-4" /> 
                  Nueva Muestra
                </Button>
                {lot.qrUrl && (
                  <Button
                    variant="outline"
                    className="w-full border-navy-300/60 text-navy-800 hover:bg-navy-100 hover:border-navy-400 hover:text-navy-900 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                    onClick={() => setIsQRModalOpen(true)}
                  >
                    <QrCode className="mr-2 h-4 w-4" /> 
                    Mostrar QR
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <QRCodeModal
        isOpen={isQRModalOpen}
        onOpenChange={setIsQRModalOpen}
        lotCode={lot.code}
        qrUrl={lot.qrUrl}
      />
    </>
  );
};

export default LotCard;