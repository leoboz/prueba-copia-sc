
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, Filter, FilterX, Database } from 'lucide-react';

interface DataViewHeaderProps {
  totalLots: number;
  filteredLots: number;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const DataViewHeader: React.FC<DataViewHeaderProps> = ({
  totalLots,
  filteredLots,
  onToggleFilters,
  showFilters
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-6 lg:mb-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
              <Database className="h-8 w-8 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-4xl font-serif text-white font-bold drop-shadow-sm">
                Vista de Datos - Lotes
              </h1>
              <p className="text-navy-200/90 text-lg font-medium">
                Visualización completa de datos con filtros avanzados
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate('/lots')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Vista de Tarjetas
            </Button>
            <Button
              onClick={onToggleFilters}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              {showFilters ? (
                <>
                  <FilterX className="h-4 w-4 mr-2" />
                  Ocultar Filtros
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-2" />
                  Mostrar Filtros
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="mt-6 flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-navy-200/80">Total de lotes:</span>
            <Badge className="bg-white/20 text-white border-white/30">
              {totalLots}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-navy-200/80">Mostrando:</span>
            <Badge className="bg-emerald-500/80 text-white border-emerald-400/50">
              {filteredLots}
            </Badge>
          </div>
          {filteredLots !== totalLots && (
            <div className="text-navy-200/60 text-sm">
              ({Math.round((filteredLots / totalLots) * 100)}% del total)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataViewHeader;
