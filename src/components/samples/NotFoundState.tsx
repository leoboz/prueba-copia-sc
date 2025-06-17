
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-8 text-center">
        <h2 className="text-xl font-medium text-countryside-soil mb-4">Muestra no encontrada</h2>
        <p className="text-countryside-brown mb-6">La muestra solicitada no existe o ha sido eliminada.</p>
        <Button
          variant="outline"
          onClick={() => navigate('/samples')}
          className="border-countryside-brown/30 hover:bg-countryside-amber hover:text-countryside-soil"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Muestras
        </Button>
      </Card>
    </div>
  );
};

export default NotFoundState;
