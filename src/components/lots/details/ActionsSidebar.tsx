
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, MoreVertical, ArrowLeft, History } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LotWithDetails } from '@/types/lot-lookup';
import { toast } from '@/hooks/use-toast';
import { generateQualityReport } from '@/utils/pdfGenerator';

interface ActionsSidebarProps {
  lot: LotWithDetails;
  statusConfig: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

const ActionsSidebar: React.FC<ActionsSidebarProps> = ({ lot, statusConfig }) => {
  const navigate = useNavigate();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  
  const handleDownloadReport = () => {
    try {
      generateQualityReport(lot);
      toast({
        title: "Descarga iniciada",
        description: "El informe de calidad se está descargando.",
      });
      setIsActionsOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el informe de calidad.",
        variant: "destructive",
      });
    }
  };

  const handleViewAllLots = () => {
    navigate('/lots');
    setIsActionsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Compact Actions Card */}
      <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white pb-3">
          <CardTitle className="text-lg font-serif flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-white to-navy-300 rounded-full"></div>
              Acciones
            </div>
            <Popover open={isActionsOpen} onOpenChange={setIsActionsOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20 p-2 h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-56 p-2 bg-white/95 backdrop-blur-sm border border-navy-200/50 shadow-xl" 
                align="end"
              >
                <div className="space-y-1">
                  <Button 
                    onClick={handleDownloadReport}
                    variant="ghost"
                    className="w-full justify-start text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition-all duration-200"
                  >
                    <Download className="h-4 w-4 mr-3" />
                    Descargar Informe PDF
                  </Button>
                  <Button 
                    onClick={handleViewAllLots}
                    variant="ghost"
                    className="w-full justify-start text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition-all duration-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-3" />
                    Ver Todos los Lotes
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <Badge 
              variant={statusConfig.variant as "default" | "secondary" | "destructive" | "outline"}
              className="px-3 py-1 text-sm font-medium"
            >
              {statusConfig.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      {lot.overridden && (
        <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white pb-3">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-white to-navy-300 rounded-full"></div>
              <History className="h-5 w-5" />
              Historial
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-700 font-medium">Estado actual:</span>
                <Badge variant={statusConfig.variant as "default" | "secondary" | "destructive" | "outline"}>
                  {statusConfig.label}
                </Badge>
              </div>
              {lot.overrideReason && (
                <div className="p-3 bg-gradient-to-br from-navy-100/50 to-navy-50 rounded-xl border border-navy-200/40 shadow-inner">
                  <p className="text-sm text-navy-800">
                    <strong className="font-semibold">Motivo:</strong> {lot.overrideReason}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActionsSidebar;
