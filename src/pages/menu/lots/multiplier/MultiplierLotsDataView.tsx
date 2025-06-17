
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLots } from '@/hooks/useLots';
import { useParameterLabels } from '@/hooks/useParameterLabels';
import LotsDataTable from '@/components/lots/multiplier/LotsDataTable';
import AdvancedFilters from '@/components/lots/multiplier/AdvancedFilters';
import ColumnSelector from '@/components/lots/multiplier/ColumnSelector';
import DataViewHeader from '@/components/lots/multiplier/DataViewHeader';
import { Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportLotsData } from '@/utils/dataExport';
import { DEFAULT_COLUMNS, type ColumnConfig, type FilterState } from '@/components/lots/multiplier/types';

const MultiplierLotsDataView: React.FC = () => {
  const { user } = useAuth();
  const { multiplierLots, isLoadingMultiplierLots } = useLots();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    variety: '',
    dateRange: { from: undefined, to: undefined },
    hasOverride: undefined,
    hasSamples: undefined
  });
  
  const [visibleColumns, setVisibleColumns] = useState<ColumnConfig[]>(
    () => {
      const saved = localStorage.getItem('multiplier-lots-columns');
      return saved ? JSON.parse(saved) : DEFAULT_COLUMNS.filter(col => col.defaultVisible);
    }
  );
  
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Get sample IDs for parameter labels
  const allSampleIds = useMemo(() => 
    multiplierLots?.flatMap(lot => lot.samples?.map(sample => sample.id) || []) || []
  , [multiplierLots]);
  
  const { data: parameterLabels } = useParameterLabels(allSampleIds);

  // Filter lots based on current filters
  const filteredLots = useMemo(() => {
    if (!multiplierLots) return [];
    
    return multiplierLots.filter(lot => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          lot.code.toLowerCase().includes(searchLower) ||
          lot.variety?.name?.toLowerCase().includes(searchLower) ||
          lot.variety?.crop?.name?.toLowerCase().includes(searchLower) ||
          lot.user?.name?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (filters.status && lot.status !== filters.status) return false;
      
      // Variety filter
      if (filters.variety && lot.variety?.name !== filters.variety) return false;
      
      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const lotDate = new Date(lot.createdAt);
        if (filters.dateRange.from && lotDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && lotDate > filters.dateRange.to) return false;
      }
      
      // Override filter
      if (filters.hasOverride !== undefined && lot.overridden !== filters.hasOverride) return false;
      
      // Samples filter
      if (filters.hasSamples !== undefined) {
        const hasSamples = (lot.samples && lot.samples.length > 0);
        if (hasSamples !== filters.hasSamples) return false;
      }
      
      return true;
    });
  }, [multiplierLots, filters]);

  const handleExport = () => {
    exportLotsData(filteredLots, visibleColumns);
  };

  const handleColumnChange = (columns: ColumnConfig[]) => {
    setVisibleColumns(columns);
    localStorage.setItem('multiplier-lots-columns', JSON.stringify(columns));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      variety: '',
      dateRange: { from: undefined, to: undefined },
      hasOverride: undefined,
      hasSamples: undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="max-w-full mx-auto px-6 py-8">
        <DataViewHeader 
          totalLots={multiplierLots?.length || 0}
          filteredLots={filteredLots.length}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />

        {/* Action Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-navy-200/40 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowColumnSelector(true)}
                variant="outline"
                className="border-navy-200 text-navy-600 hover:bg-navy-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Columnas
              </Button>
              <span className="text-sm text-navy-600">
                {visibleColumns.length} columnas visibles
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-navy-200 text-navy-600 hover:bg-navy-50"
                disabled={filteredLots.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            lots={multiplierLots || []}
          />
        )}

        {/* Data Table */}
        <LotsDataTable
          lots={filteredLots}
          visibleColumns={visibleColumns}
          parameterLabels={parameterLabels || []}
          isLoading={isLoadingMultiplierLots}
        />

        {/* Column Selector Modal */}
        <ColumnSelector
          isOpen={showColumnSelector}
          onOpenChange={setShowColumnSelector}
          availableColumns={DEFAULT_COLUMNS}
          visibleColumns={visibleColumns}
          onColumnsChange={handleColumnChange}
        />
      </div>
    </div>
  );
};

export default MultiplierLotsDataView;
