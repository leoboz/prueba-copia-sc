
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface LotQRCodeProps {
  lotCode: string;
  qrUrl?: string;
}

const LotQRCode: React.FC<LotQRCodeProps> = ({ lotCode, qrUrl }) => {
  if (!qrUrl) {
    return null;
  }

  const handleDownloadQR = () => {
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `QR-${lotCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "QR descargado",
        description: "El código QR ha sido descargado exitosamente.",
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el código QR.",
        variant: "destructive",
      });
    }
  };

  const handleShareQR = async () => {
    try {
      if (navigator.share) {
        // Convert data URL to blob for sharing
        const fetchResponse = await fetch(qrUrl);
        const blob = await fetchResponse.blob();
        const file = new File([blob], `QR-${lotCode}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `Código QR para lote ${lotCode}`,
          text: 'Escanea este código QR para ver los detalles del lote',
          files: [file]
        });
      } else {
        // Fallback if Web Share API is not available
        toast({
          title: "Compartir no disponible",
          description: "Tu navegador no soporta la función de compartir.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      toast({
        title: "Error",
        description: "No se pudo compartir el código QR.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <CardTitle className="flex items-center text-xl font-serif">
          <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
          <QrCode className="h-6 w-6 mr-3" />
          Código QR del Lote
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl shadow-lg border border-navy-200/30">
              <img 
                src={qrUrl} 
                alt={`QR Code for ${lotCode}`} 
                className="rounded-xl"
                width={200}
                height={200}
              />
            </div>
          </div>
          
          <p className="text-sm text-center text-navy-700 font-medium">
            Escanee este código para acceder rápidamente a los detalles del lote
          </p>
          
          <div className="flex justify-center space-x-3">
            <Button 
              variant="outline" 
              className="border-navy-300/50 text-navy-700 hover:bg-navy-50 hover:text-navy-900 hover:border-navy-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
              onClick={handleDownloadQR}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
            
            {navigator.share && (
              <Button 
                variant="outline" 
                className="border-navy-300/50 text-navy-700 hover:bg-navy-50 hover:text-navy-900 hover:border-navy-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
                onClick={handleShareQR}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LotQRCode;
