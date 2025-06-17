
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Search, X, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Lot } from '@/types';
import { FilterState } from './types';

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  lots: Lot[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  lots
}) => {
  // Get unique values for select options
  const uniqueStatuses = Array.from(new Set(lots.map(lot => lot.status).filter(Boolean)));
  const uniqueVarieties = Array.from(new Set(lots.map(lot => lot.variety?.name).filter(Boolean)));

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.variety) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.hasOverride !== undefined) count++;
    if (filters.hasSamples !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-navy-200/40 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-navy-600" />
          <h3 className="text-lg font-medium text-navy-900">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Badge className="bg-navy-600 text-white">
              {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="border-navy-200 text-navy-600 hover:bg-navy-50"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy-700">Búsqueda general</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
            <Input
              placeholder="Código, variedad, cultivo..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 border-navy-200/40 focus:border-navy-400"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy-700">Estado</label>
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="border-navy-200/40 focus:border-navy-400">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Variety */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy-700">Variedad</label>
          <Select
            value={filters.variety}
            onValueChange={(value) => updateFilter('variety', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="border-navy-200/40 focus:border-navy-400">
              <SelectValue placeholder="Todas las variedades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las variedades</SelectItem>
              {uniqueVarieties.map((variety) => (
                <SelectItem key={variety} value={variety!}>
                  {variety}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range From */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy-700">Fecha desde</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-navy-200/40 hover:bg-navy-50"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  format(filters.dateRange.from, 'dd/MM/yyyy', { locale: es })
                ) : (
                  'Seleccionar fecha'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.from}
                onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date })}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range To */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy-700">Fecha hasta</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-navy-200/40 hover:bg-navy-50"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.to ? (
                  format(filters.dateRange.to, 'dd/MM/yyyy', { locale: es })
                ) : (
                  'Seleccionar fecha'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.to}
                onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date })}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Has Override */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy-700">Con sobreescritura</label>
          <Select
            value={filters.hasOverride === undefined ? 'all' : filters.hasOverride.toString()}
            onValueChange={(value) => updateFilter('hasOverride', value === 'all' ? undefined : value === 'true')}
          >
            <SelectTrigger className="border-navy-200/40 focus:border-navy-400">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Con sobreescritura</SelectItem>
              <SelectItem value="false">Sin sobreescritura</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Has Samples */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy-700">Con muestras</label>
          <Select
            value={filters.hasSamples === undefined ? 'all' : filters.hasSamples.toString()}
            onValueChange={(value) => updateFilter('hasSamples', value === 'all' ? undefined : value === 'true')}
          >
            <SelectTrigger className="border-navy-200/40 focus:border-navy-400">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Con muestras</SelectItem>
              <SelectItem value="false">Sin muestras</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
