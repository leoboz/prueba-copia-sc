
import React from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Search, QrCode, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-serif text-countryside-soil">
          Bienvenido(a), {user?.name || 'Agricultor'}
        </h1>
        <p className="text-countryside-brown-dark mt-1">
          Consulte la calidad de sus semillas
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-serif font-medium text-countryside-soil mb-4 flex items-center">
            <QrCode className="h-5 w-5 mr-2 text-countryside-green" />
            Escanear Código QR
          </h2>
          
          <p className="text-countryside-brown mb-6">
            Escanee el código QR en el envase de sus semillas para ver información detallada sobre su calidad.
          </p>
          
          <div className="flex items-center justify-center p-10 border-2 border-dashed border-countryside-brown/20 rounded-lg bg-countryside-cream/20 mb-6">
            <Button 
              variant="outline" 
              className="flex items-center border-countryside-brown/30 text-countryside-soil hover:bg-countryside-green hover:text-white"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Abrir Escáner QR
            </Button>
          </div>
          
          <Link to="/lot">
            <Button 
              variant="outline"
              className="w-full flex justify-between items-center border-countryside-brown/30 text-countryside-soil hover:bg-countryside-cream"
            >
              <span>Ver página de escaneo</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-xl font-serif font-medium text-countryside-soil mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2 text-countryside-green" />
            Buscar por Código
          </h2>
          
          <p className="text-countryside-brown mb-6">
            Ingrese el código del lote para obtener información detallada sobre la calidad de sus semillas.
          </p>
          
          <div className="p-10 border-2 border-dashed border-countryside-brown/20 rounded-lg bg-countryside-cream/20 mb-6">
            <div className="space-y-4">
              <p className="text-countryside-brown text-sm">Ingrese el código impreso en la etiqueta o factura de compra:</p>
              
              <div className="flex flex-col space-y-4">
                <input 
                  type="text" 
                  placeholder="Ejemplo: LOT-12345" 
                  className="border border-countryside-brown/30 rounded-md p-3 text-countryside-soil focus:outline-none focus:ring-2 focus:ring-countryside-green"
                />
                <Button className="bg-countryside-green hover:bg-countryside-green-dark self-end">
                  Buscar
                </Button>
              </div>
            </div>
          </div>
          
          <Link to="/lot">
            <Button 
              variant="outline"
              className="w-full flex justify-between items-center border-countryside-brown/30 text-countryside-soil hover:bg-countryside-cream"
            >
              <span>Ver página de búsqueda</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>

      <Card className="p-6 bg-white mb-8">
        <h2 className="text-xl font-serif font-medium text-countryside-soil mb-4">
          ¿Por qué es importante la calidad de las semillas?
        </h2>
        
        <div className="text-countryside-brown space-y-4">
          <p>
            Las semillas de alta calidad son fundamentales para el éxito de su cultivo. La calidad de las semillas afecta directamente:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>La tasa de germinación y vigor de sus plantas</li>
            <li>La uniformidad del cultivo</li>
            <li>La resistencia a enfermedades y plagas</li>
            <li>El rendimiento final de la cosecha</li>
          </ul>
          
          <p>
            Nuestro sistema de certificación de calidad garantiza que usted tenga acceso a información transparente y verificada sobre las semillas que adquiere.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
