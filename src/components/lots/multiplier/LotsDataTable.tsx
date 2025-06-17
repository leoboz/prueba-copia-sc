

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ArrowUpDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Lot } from '@/types';
import { ColumnConfig, SortConfig } from './types';

interface LotsDataTableProps {
  lots: Lot[];
  visibleColumns: ColumnConfig[];
  parameterLabels: any[];
  isLoading: boolean;
}

const LotsDataTable: React.FC<LotsDataTableProps> = ({
  lots,
  visibleColumns,
  parameterLabels,
  isLoading
}) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Define getNestedValue function BEFORE it's used in useMemo
  const getNestedValue = (obj: any, path: string) => {
    const value = path.split('.').reduce((current, key) => current?.[key], obj);
    
    // Special handling for specific fields
    if (path === 'samples' && Array.isArray(value)) {
      return value.length; // Return sample count for sorting
    }
    
    // Handle date strings
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Date(value);
    }
    
    return value;
  };

  // Sort lots based on current sort configuration
  const sortedLots = useMemo(() => {
    if (!sortConfig) return lots;

    return [...lots].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.column);
      const bValue = getNestedValue(b, sortConfig.column);

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        // Convert to string for comparison
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        comparison = aString.localeCompare(bString);
      }

      return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
  }, [lots, sortConfig, getNestedValue]);

  const handleSort = (column: ColumnConfig) => {
    if (!column.sortable) return;

    setSortConfig(current => {
      if (!current || current.column !== column.accessor) {
        return { column: column.accessor, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { column: column.accessor, direction: 'desc' };
      }
      return null;
    });
  };

  const formatCellValue = (column: ColumnConfig, lot: Lot) => {
    const value = getNestedValue(lot, column.accessor);

    if (column.formatter) {
      return column.formatter(value, lot);
    }

    switch (column.type) {
      case 'date':
        return value ? format(new Date(value), 'dd/MM/yyyy', { locale: es }) : '-';
      
      case 'number':
        if (column.id === 'sampleCount') {
          return lot.samples?.length || 0;
        }
        return value || '-';
      
      case 'boolean':
        if (column.id === 'qrUrl') {
          return lot.qrUrl ? (
            <Badge className="bg-emerald-500 text-white">Sí</Badge>
          ) : (
            <Badge variant="outline" className="border-navy-200 text-navy-600">No</Badge>
          );
        }
        return value ? (
          <Badge className="bg-emerald-500 text-white">Sí</Badge>
        ) : (
          <Badge variant="outline" className="border-navy-200 text-navy-600">No</Badge>
        );
      
      case 'status':
        const statusColors = {
          active: 'bg-emerald-500 text-white',
          inactive: 'bg-gray-400 text-white',
          pending: 'bg-amber-500 text-white',
          blocked: 'bg-red-500 text-white'
        };
        return (
          <Badge className={statusColors[value as keyof typeof statusColors] || 'bg-navy-600 text-white'}>
            {value || 'N/A'}
          </Badge>
        );
      
      case 'badge':
        if (column.id === 'qualityLabel') {
          // Calculate quality label based on parameter labels
          const lotSamples = lot.samples || [];
          const lotSampleIds = lotSamples.map(s => s.id);
          
          const lotParameterLabels = parameterLabels?.filter(label =>
            lotSampleIds.some(sampleId => 
              label.parameter && label.label
            )
          ) || [];

          let combinedLabel = 'Ninguna';
          if (lotParameterLabels.length > 0) {
            if (lotParameterLabels.some(l => l.label?.toLowerCase() === 'retenido')) {
              combinedLabel = 'Retenido';
            } else if (lotParameterLabels.some(l => l.label?.toLowerCase() === 'standard')) {
              combinedLabel = 'Standard';
            } else if (lotParameterLabels.every(l => l.label?.toLowerCase() === 'superior')) {
              combinedLabel = 'Superior';
            }
          }

          const labelColors = {
            'Superior': 'bg-emerald-500 text-white',
            'Standard': 'bg-navy-600 text-white',
            'Retenido': 'bg-red-500 text-white',
            'Ninguna': 'bg-gray-400 text-white'
          };

          return (
            <Badge className={labelColors[combinedLabel as keyof typeof labelColors]}>
              {combinedLabel}
            </Badge>
          );
        }
        return value || '-';
      
      default:
        return value || '-';
    }
  };

  const getSortIcon = (column: ColumnConfig) => {
    if (!column.sortable) return null;
    
    if (!sortConfig || sortConfig.column !== column.accessor) {
      return <ArrowUpDown className="h-4 w-4 text-navy-400" />;
    }
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-navy-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-navy-600" />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-navy-200/40 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-navy-100 rounded"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 bg-navy-50 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-navy-200/40 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-navy-50 to-navy-100 sticky top-0 z-10">
            <TableRow className="border-navy-200/40">
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.id}
                  className="text-navy-900 font-medium cursor-pointer hover:bg-navy-100/50 transition-colors"
                  style={{ minWidth: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {getSortIcon(column)}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-navy-900 font-medium w-20">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLots.map((lot, index) => (
              <TableRow
                key={lot.id}
                className={`
                  border-navy-200/20 hover:bg-navy-50/50 transition-colors cursor-pointer
                  ${index % 2 === 0 ? 'bg-white/60' : 'bg-navy-50/30'}
                `}
                onClick={() => navigate(`/lots/${lot.id}`)}
              >
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    className="py-3 px-4 text-navy-800 text-sm"
                    style={{ minWidth: column.width }}
                  >
                    {formatCellValue(column, lot)}
                  </TableCell>
                ))}
                <TableCell className="py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lots/${lot.id}`);
                    }}
                    className="h-8 w-8 p-0 hover:bg-navy-100"
                  >
                    <ExternalLink className="h-4 w-4 text-navy-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {sortedLots.length === 0 && (
        <div className="text-center py-12">
          <div className="text-navy-400 text-lg mb-2">No se encontraron lotes</div>
          <div className="text-navy-600 text-sm">Ajusta los filtros para ver más resultados</div>
        </div>
      )}
    </div>
  );
};

export default LotsDataTable;
