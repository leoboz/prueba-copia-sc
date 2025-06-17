
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube, Package, ArrowRight } from 'lucide-react';
import { Sample } from '@/types';
import SampleCard from '@/components/samples/SampleCard';

interface SamplesGridProps {
  samples: Sample[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
}

const SamplesGrid: React.FC<SamplesGridProps> = ({
  samples,
  isLoading,
  searchTerm,
  statusFilter,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (sampleId: string) => {
    navigate(`/multiplier/samples/${sampleId}`);
  };

  if (isLoading) {
    return (
      <Card className="p-12 text-center bg-white/90 backdrop-blur-sm shadow-xl border-navy-200/40">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-navy-100 to-navy-200 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-navy-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-navy-600 text-lg font-medium">Cargando muestras...</p>
        <p className="text-navy-400 text-sm mt-1">Preparando información de análisis</p>
      </Card>
    );
  }

  if (samples.length > 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {samples.map(sample => (
          <div key={sample.id} className="group">
            <SampleCard 
              sample={sample}
              onViewDetails={() => handleViewDetails(sample.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="p-12 text-center bg-white/90 backdrop-blur-sm shadow-xl border-navy-200/40">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-navy-100 to-navy-200 rounded-full flex items-center justify-center">
        <TestTube className="h-10 w-10 text-navy-600" />
      </div>
      <h3 className="text-xl font-semibold text-navy-800 mb-2">
        {searchTerm || statusFilter !== 'all' ? 'No se encontraron muestras' : 'No hay muestras disponibles'}
      </h3>
      <p className="text-navy-600 mb-6 max-w-md mx-auto">
        {searchTerm || statusFilter !== 'all' 
          ? 'Intenta ajustar los filtros de búsqueda para encontrar las muestras que buscas.'
          : 'Las muestras aparecerán aquí una vez que se analicen los lotes creados.'
        }
      </p>
      {(!searchTerm && statusFilter === 'all') && (
        <Button 
          onClick={() => navigate('/lots')}
          className="bg-navy-700 hover:bg-navy-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Package className="mr-2 h-4 w-4" />
          Ver Mis Lotes
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </Card>
  );
};

export default SamplesGrid;
