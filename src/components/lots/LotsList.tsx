
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lot } from '@/types';
import { Package, Search } from 'lucide-react';
import LotCard from './LotCard';

interface LotsListProps {
  isLoading: boolean;
  filteredLots: Lot[];
  lotLabels: Record<string, { 
    combined: string;
    individual: { parameter: string; label: string }[] 
  }>;
  onCreateSample: (lotId: string) => void;
  onClearFilters: () => void;
}

const LotsList: React.FC<LotsListProps> = ({
  isLoading,
  filteredLots,
  lotLabels,
  onCreateSample,
  onClearFilters
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-navy-50/60 to-navy-100/30 rounded-3xl border border-navy-200/40 shadow-xl">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-navy-200/30 border-t-navy-700 mx-auto"></div>
            <Package className="absolute inset-0 m-auto h-8 w-8 text-navy-700 animate-pulse" />
          </div>
          <div>
            <p className="text-navy-800 font-semibold text-lg">Cargando lotes...</p>
            <p className="text-navy-600/80 text-sm font-medium">Obteniendo la información más reciente</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredLots.length === 0) {
    return (
      <Card className="overflow-hidden border-navy-200/40 shadow-2xl bg-gradient-to-br from-white via-navy-50/30 to-navy-100/20">
        <CardContent className="p-16 text-center">
          <div className="space-y-8">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-navy-100/80 to-navy-200/60 flex items-center justify-center shadow-xl">
              <Search className="h-12 w-12 text-navy-600" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-navy-800 mb-3">
                No se encontraron lotes
              </h3>
              <p className="text-navy-600/80 mb-8 text-lg font-medium">
                No hay lotes que coincidan con los filtros aplicados
              </p>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              className="border-navy-300/60 text-navy-800 hover:bg-navy-100 hover:text-navy-900 hover:border-navy-400 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold px-8 py-4"
              onClick={onClearFilters}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-white/90 via-navy-50/50 to-white/90 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-navy-800 font-bold text-lg">
              {filteredLots.length} lote{filteredLots.length !== 1 ? 's' : ''} encontrado{filteredLots.length !== 1 ? 's' : ''}
            </p>
            <p className="text-navy-600/80 text-sm font-medium">
              Resultados ordenados por fecha de creación
            </p>
          </div>
        </div>
      </div>

      {/* Lots grid */}
      <div className="space-y-6">
        {filteredLots.map((lot, index) => (
          <div 
            key={lot.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <LotCard 
              lot={lot} 
              labelInfo={lotLabels[lot.id] || { combined: 'Ninguna', individual: [] }}
              onCreateSample={onCreateSample}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LotsList;
