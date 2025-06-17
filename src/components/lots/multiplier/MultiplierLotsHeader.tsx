
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Package, LayoutGrid, Database } from 'lucide-react';

const MultiplierLotsHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isDataView = location.pathname === '/lots/data-view';

  const handleCreateLot = () => {
    navigate('/lots/create');
  };

  const toggleView = () => {
    if (isDataView) {
      navigate('/lots');
    } else {
      navigate('/lots/data-view');
    }
  };

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-3xl p-8 mb-8 shadow-2xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4 mb-6 lg:mb-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
            {isDataView ? (
              <Database className="h-8 w-8 text-white drop-shadow-sm" />
            ) : (
              <Package className="h-8 w-8 text-white drop-shadow-sm" />
            )}
          </div>
          <div>
            <h1 className="text-4xl font-serif text-white font-bold drop-shadow-sm">
              {isDataView ? 'Vista de Datos - Lotes' : 'Mis Lotes'}
            </h1>
            <p className="text-navy-200/90 text-lg font-medium">
              {isDataView 
                ? 'Visualización completa de datos con filtros avanzados'
                : 'Gestione sus lotes de semillas y envíe muestras para análisis'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={toggleView}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            {isDataView ? (
              <>
                <LayoutGrid className="h-5 w-5 mr-2" />
                Vista de Tarjetas
              </>
            ) : (
              <>
                <Database className="h-5 w-5 mr-2" />
                Vista de Datos
              </>
            )}
          </Button>
          <Button 
            onClick={handleCreateLot} 
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Crear Lote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiplierLotsHeader;
