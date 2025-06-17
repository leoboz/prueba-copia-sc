
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, AlertTriangle, Shield } from 'lucide-react';
import { useLotLabels } from '@/hooks/useLotLabels';
import { getEffectiveLotLabel, hasPGOOverride, getLotLabelColor } from '@/utils/lotStatusUtils';

interface GeneticsLotsTableProps {
  lots: any[];
  isLoading: boolean;
}

const GeneticsLotsTable: React.FC<GeneticsLotsTableProps> = ({ lots, isLoading }) => {
  const navigate = useNavigate();
  const { labels } = useLotLabels();

  const getStatusIcon = (lot: any) => {
    const effectiveLabel = getEffectiveLotLabel(lot, labels || []);
    const labelName = effectiveLabel?.name?.toLowerCase();
    
    switch (labelName) {
      case 'superior':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'standard':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'retenido':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLabelBadge = (lot: any) => {
    const effectiveLabel = getEffectiveLotLabel(lot, labels || []);
    const hasOverride = hasPGOOverride(lot);
    
    if (!effectiveLabel) {
      return (
        <Badge className="text-gray-600 bg-gray-50 border-gray-200">
          No analizado
        </Badge>
      );
    }

    return (
      <Badge className={`${getLotLabelColor(effectiveLabel.name)} flex items-center gap-1`}>
        {hasOverride && <Shield className="h-3 w-3" />}
        {effectiveLabel.name}
        {hasOverride && ' (PGO)'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-countryside-brown">Cargando lotes...</p>
      </Card>
    );
  }

  if (lots.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-countryside-brown">No se encontraron lotes.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cultivo</TableHead>
              <TableHead>Variedad</TableHead>
              <TableHead>Multiplicador</TableHead>
              <TableHead>Planta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lots.map((lot) => (
              <TableRow key={lot.id}>
                <TableCell className="font-medium">{lot.code}</TableCell>
                <TableCell>{lot.variety?.crop?.name || '-'}</TableCell>
                <TableCell>{lot.variety?.name || '-'}</TableCell>
                <TableCell>
                  {lot.user?.name || lot.user?.email || 'No especificado'}
                </TableCell>
                <TableCell>{lot.plant?.name || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(lot)}
                    {getLabelBadge(lot)}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(lot.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/lots/${lot.code}`)}
                  >
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default GeneticsLotsTable;
