
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationHeaderProps {
  title: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-3xl p-8 mb-8 shadow-2xl">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/samples')}
          className="text-white hover:bg-white/10 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Muestras
        </Button>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
            <ArrowLeft className="h-8 w-8 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-4xl font-serif text-white font-bold drop-shadow-sm">
              {title}
            </h1>
            <p className="text-navy-200/90 text-lg font-medium">
              Detalles de la muestra seleccionada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
