import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Package, Calendar, Building, TestTube } from 'lucide-react';
import { Lot } from '@/types';
import { useOriginLotFilters } from '../hooks/useOriginLotFilters';

interface OriginLotSelectionStepProps {
  lotTypeId?: string;
  selectedOriginLotId?: string;
  onSelect: (originLotId: string, originLot: Lot) => void;
}

export const OriginLotSelectionStep: React.FC<OriginLotSelectionStepProps> = ({
  lotTypeId,
  selectedOriginLotId,
  onSelect
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    varietyId: '',
    categoryId: '',
    plantId: '',
    campaignId: ''
  });

  const {
    lots,
    isLoading,
    hasMore,
    loadMore,
    filters
  } = useOriginLotFilters({
    currentLotTypeId: lotTypeId,
    searchCode,
    ...selectedFilters
  });

  const selectedLot = lots.find(lot => lot.id === selectedOriginLotId);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      varietyId: '',
      categoryId: '',
      plantId: '',
      campaignId: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // ENHANCED: Force inheritance when selecting a lot
  const handleLotSelection = (originLotId: string, originLot: Lot) => {
    console.log('🎯 Origin lot selected:', originLot.code);
    console.log('📦 Will inherit:', {
      variety: originLot.variety?.name,
      category: originLot.category?.name,
      plant: originLot.plant?.name,
      campaign: originLot.campaign?.name
    });
    
    onSelect(originLotId, originLot);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-navy-900 mb-2">
          Seleccionar Lote de Origen
        </h2>
        <p className="text-navy-600">
          Elija el lote del cual heredar los datos principales automáticamente
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar y Filtrar Lotes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por código de lote..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </Button>
            
            {(selectedFilters.varietyId || selectedFilters.categoryId || 
              selectedFilters.plantId || selectedFilters.campaignId) && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                Limpiar Filtros
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="variety-filter">Variedad</Label>
                <select
                  id="variety-filter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedFilters.varietyId}
                  onChange={(e) => handleFilterChange('varietyId', e.target.value)}
                >
                  <option value="">Todas las variedades</option>
                  {filters.varieties.map(variety => (
                    <option key={variety.id} value={variety.id}>
                      {variety.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="category-filter">Categoría</Label>
                <select
                  id="category-filter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedFilters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {filters.categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="plant-filter">Planta</Label>
                <select
                  id="plant-filter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedFilters.plantId}
                  onChange={(e) => handleFilterChange('plantId', e.target.value)}
                >
                  <option value="">Todas las plantas</option>
                  {filters.plants.map(plant => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="campaign-filter">Campaña</Label>
                <select
                  id="campaign-filter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedFilters.campaignId}
                  onChange={(e) => handleFilterChange('campaignId', e.target.value)}
                >
                  <option value="">Todas las campañas</option>
                  {filters.campaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && lots.length === 0 ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))
        ) : lots.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron lotes
            </h3>
            <p className="text-gray-500">
              No hay lotes disponibles que coincidan con los criterios de búsqueda.
            </p>
          </div>
        ) : (
          lots.map((lot) => {
            const isSelected = selectedOriginLotId === lot.id;
            
            return (
              <Card
                key={lot.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isSelected
                    ? 'ring-2 ring-countryside-green bg-countryside-green/5'
                    : 'hover:bg-navy-50/50'
                }`}
                onClick={() => handleLotSelection(lot.id, lot)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Lot Code */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-navy-900 text-lg">{lot.code}</h3>
                      {isSelected && (
                        <Badge className="bg-countryside-green text-white">
                          Seleccionado
                        </Badge>
                      )}
                    </div>

                    {/* Status */}
                    <Badge variant="secondary" className="capitalize">
                      {lot.status}
                    </Badge>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <TestTube className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Variedad:</span>
                        <span>{lot.variety?.name || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Categoría:</span>
                        <span>{lot.category?.name || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Planta:</span>
                        <span>{lot.plant?.name || 'N/A'}</span>
                      </div>
                      
                      {lot.campaign && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Campaña:</span>
                          <span>{lot.campaign.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Creation Date */}
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Creado: {formatDate(lot.createdAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? 'Cargando...' : 'Cargar Más'}
          </Button>
        </div>
      )}

      {/* Selection Preview */}
      {selectedLot && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">Lote seleccionado para herencia</h4>
                <p className="text-sm text-green-700">
                  Se heredarán automáticamente los datos de <strong>{selectedLot.code}</strong>: variedad, categoría, planta y campaña.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  <strong>Nota:</strong> La unidad NO se hereda y debe seleccionarse según el nuevo tipo de lote.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
