
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TestTube, TrendingUp, Package } from 'lucide-react';

const MultiplierSamplesHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="mb-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-800 via-navy-900 to-navy-800 shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-40 translate-x-40"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-navy-700/30 to-transparent rounded-full translate-y-30 -translate-x-30"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-navy-600/20 to-navy-500/20 rounded-full"></div>
        </div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
                  <TestTube className="h-8 w-8 text-white drop-shadow-sm" />
                </div>
                <div>
                  <h1 className="text-4xl font-serif text-white font-bold drop-shadow-lg">
                    Mis Muestras
                  </h1>
                  <div className="h-1 w-24 bg-gradient-to-r from-white to-navy-300 rounded-full mt-2"></div>
                </div>
              </div>
              
              <p className="text-navy-100/90 text-xl font-medium max-w-2xl leading-relaxed">
                Centro de control para el seguimiento y análisis de muestras de sus lotes
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/lots')}
              >
                <Package className="mr-2 h-5 w-5" />
                Ver Lotes
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/dashboard')}
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MultiplierSamplesHeader;
