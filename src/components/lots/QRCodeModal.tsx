
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Share2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lotCode: string;
  qrUrl?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  lotCode, 
  qrUrl 
}) => {
  if (!qrUrl) {
    return null;
  }

  const handleDownloadQR = () => {
    try {
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
        const fetchResponse = await fetch(qrUrl);
        const blob = await fetchResponse.blob();
        const file = new File([blob], `QR-${lotCode}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `Código QR para lote ${lotCode}`,
          text: 'Escanea este código QR para ver los detalles del lote',
          files: [file]
        });
      } else {
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-countryside-soil">
            <QrCode className="h-5 w-5 mr-2 text-countryside-green" />
            Código QR - Lote {lotCode}
          </DialogTitle>
        </DialogHeader>
        
        <Card className="countryside-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-center">
              <img 
                src={qrUrl} 
                alt={`QR Code for ${lotCode}`} 
                className="border border-countryside-brown/20 rounded-lg p-2 bg-white"
                width={200}
                height={200}
              />
            </div>
            
            <p className="text-sm text-center text-countryside-brown">
              Escanee este código para acceder rápidamente a los detalles del lote
            </p>
            
            <div className="flex justify-center space-x-3">
              <Button 
                variant="outline" 
                className="border-countryside-brown/30 text-countryside-soil hover:bg-countryside-amber"
                onClick={handleDownloadQR}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              
              {navigator.share && (
                <Button 
                  variant="outline" 
                  className="border-countryside-brown/30 text-countryside-soil hover:bg-countryside-amber"
                  onClick={handleShareQR}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
