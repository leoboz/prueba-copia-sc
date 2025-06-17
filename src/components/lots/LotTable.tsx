
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lot } from '@/types';
import { Eye, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LotTableProps {
  lots: Lot[];
  isLoading: boolean;
  showActions?: boolean;
  emptyMessage?: string;
}

export const LotTable: React.FC<LotTableProps> = ({
  lots,
  isLoading,
  showActions = false,
  emptyMessage = "No hay lotes disponibles"
}) => {
  const navigate = useNavigate();

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprobado':
        return 'default';
      case 'retenido':
        return 'secondary';
      case 'rechazado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark"></div>
            <span className="ml-2">Cargando lotes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lots || lots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Lotes ({lots.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Variedad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              {showActions && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lots.map((lot) => (
              <TableRow key={lot.id}>
                <TableCell className="font-medium">{lot.code}</TableCell>
                <TableCell>{lot.variety?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(lot.status)}>
                    {lot.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(lot.createdAt).toLocaleDateString('es-ES')}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/lots/${lot.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
