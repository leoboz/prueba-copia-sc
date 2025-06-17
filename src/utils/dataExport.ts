
import { Lot } from '@/types';
import { ColumnConfig } from '@/components/lots/multiplier/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const exportLotsData = (lots: Lot[], columns: ColumnConfig[]) => {
  // Create CSV content
  const headers = columns.map(col => col.label);
  const csvContent = [
    headers.join(','),
    ...lots.map(lot => 
      columns.map(col => {
        const value = getNestedValue(lot, col.accessor);
        return formatValueForExport(value, col, lot);
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `lotes_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const formatValueForExport = (value: any, column: ColumnConfig, lot: Lot): string => {
  if (value === null || value === undefined) return '';

  switch (column.type) {
    case 'date':
      return value ? format(new Date(value), 'dd/MM/yyyy', { locale: es }) : '';
    
    case 'number':
      if (column.id === 'sampleCount') {
        return (lot.samples?.length || 0).toString();
      }
      return value?.toString() || '0';
    
    case 'boolean':
      if (column.id === 'qrUrl') {
        return lot.qrUrl ? 'Sí' : 'No';
      }
      return value ? 'Sí' : 'No';
    
    case 'status':
    case 'badge':
      return value?.toString() || '';
    
    default:
      // Escape commas and quotes for CSV
      const stringValue = value?.toString() || '';
      if (stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
  }
};
