
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { ColumnConfig } from './types';

interface ColumnSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableColumns: ColumnConfig[];
  visibleColumns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  isOpen,
  onOpenChange,
  availableColumns,
  visibleColumns,
  onColumnsChange
}) => {
  const [localColumns, setLocalColumns] = useState<ColumnConfig[]>(visibleColumns);

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    if (checked) {
      const columnToAdd = availableColumns.find(col => col.id === columnId);
      if (columnToAdd) {
        setLocalColumns(prev => [...prev, columnToAdd]);
      }
    } else {
      setLocalColumns(prev => prev.filter(col => col.id !== columnId));
    }
  };

  const handleApply = () => {
    onColumnsChange(localColumns);
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultColumns = availableColumns.filter(col => col.defaultVisible);
    setLocalColumns(defaultColumns);
  };

  const handleSelectAll = () => {
    setLocalColumns([...availableColumns]);
  };

  const handleSelectNone = () => {
    setLocalColumns([]);
  };

  const isColumnVisible = (columnId: string) => {
    return localColumns.some(col => col.id === columnId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-navy-900">
            Configurar Columnas
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex items-center justify-between p-4 bg-navy-50/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-navy-200 text-navy-600">
                {localColumns.length} de {availableColumns.length} columnas
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="border-navy-200 text-navy-600 hover:bg-navy-50"
              >
                <Eye className="h-4 w-4 mr-1" />
                Todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectNone}
                className="border-navy-200 text-navy-600 hover:bg-navy-50"
              >
                <EyeOff className="h-4 w-4 mr-1" />
                Ninguna
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-navy-200 text-navy-600 hover:bg-navy-50"
              >
                Por defecto
              </Button>
            </div>
          </div>

          {/* Column List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {availableColumns.map((column) => (
              <div
                key={column.id}
                className="flex items-center justify-between p-3 border border-navy-200/40 rounded-lg hover:bg-navy-50/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-4 w-4 text-navy-400 cursor-move" />
                  <Checkbox
                    id={column.id}
                    checked={isColumnVisible(column.id)}
                    onCheckedChange={(checked) => handleColumnToggle(column.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={column.id}
                      className="text-sm font-medium text-navy-900 cursor-pointer"
                    >
                      {column.label}
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-xs border-navy-200 text-navy-600"
                      >
                        {column.type}
                      </Badge>
                      {column.sortable && (
                        <Badge
                          variant="outline"
                          className="text-xs border-emerald-200 text-emerald-600"
                        >
                          Ordenable
                        </Badge>
                      )}
                      {column.defaultVisible && (
                        <Badge
                          variant="outline"
                          className="text-xs border-amber-200 text-amber-600"
                        >
                          Por defecto
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-navy-500">
                  {column.width}px
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-navy-200/40">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-navy-200 text-navy-600 hover:bg-navy-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApply}
              className="bg-navy-900 hover:bg-navy-800 text-white"
            >
              Aplicar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnSelector;
