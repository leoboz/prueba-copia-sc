import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { LotWithDetails } from '@/types/lot-lookup';
import { toast } from '@/hooks/use-toast';
import { generateQualityReport } from '@/utils/pdfGenerator';
import { useLotLabels } from '@/hooks/useLotLabels';
import { getEffectiveLotLabel } from '@/utils/lotStatusUtils';

interface LotDetailsHeaderProps {
  lot: LotWithDetails;
  statusConfig: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
    color: string;
  };
}

const LotDetailsHeader: React.FC<LotDetailsHeaderProps> = ({ lot, statusConfig }) => {
  const navigate = useNavigate();
  const { labels } = useLotLabels();
  
  console.log('DEBUG: useLotLabels in LotDetailsHeader:', { labels });

  const effectiveLabel = getEffectiveLotLabel(lot, labels || []);
  const effectiveLabelName = effectiveLabel?.name || 'No analizado';
  
  const StatusIcon = statusConfig.icon;
  
  const handleDownloadReport = () => {
    try {
      generateQualityReport(lot);
      toast({
        title: "Descarga iniciada",
        description: "El informe de calidad se está descargando.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el informe de calidad.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border-b border-navy-700/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                <StatusIcon className="h-8 w-8 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-serif text-white font-bold drop-shadow-sm">
                  Lote {lot.code}
                </h1>
                <p className="text-navy-200/90 text-lg font-medium">
                  {lot.variety?.name} • {lot.variety?.crop?.name}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-white font-medium text-sm">{effectiveLabelName}</span>
              </div>
            </div>
            <Button 
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar Informe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotDetailsHeader;