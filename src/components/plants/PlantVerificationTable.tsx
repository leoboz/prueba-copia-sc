
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Check, X, Clock, Factory } from 'lucide-react';
import { Plant } from '@/types/master-data';

interface PlantVerificationTableProps {
  plants: Plant[];
  onVerifyPlant: (plantId: string, isVerified: boolean) => Promise<void>;
  isUpdating: boolean;
}

export const PlantVerificationTable = ({ plants, onVerifyPlant, isUpdating }: PlantVerificationTableProps) => {
  const handleVerifyPlant = async (plantId: string, isVerified: boolean) => {
    try {
      await onVerifyPlant(plantId, isVerified);
      toast({
        title: isVerified ? "Planta verificada" : "Planta rechazada",
        description: `La planta ha sido ${isVerified ? 'verificada' : 'rechazada'} exitosamente`,
      });
    } catch (error) {
      console.error("Error updating plant:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la planta",
        variant: "destructive"
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Multiplicador</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha de Creación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plants.map((plant) => (
          <TableRow key={plant.id}>
            <TableCell className="font-medium">{plant.name}</TableCell>
            <TableCell>{plant.multiplierId}</TableCell>
            <TableCell>
              <Badge variant={plant.isVerified ? "default" : "secondary"}>
                {plant.isVerified ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Verificada
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Pendiente
                  </>
                )}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(plant.createdAt).toLocaleDateString('es-ES')}
            </TableCell>
            <TableCell className="text-right">
              {!plant.isVerified && (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerifyPlant(plant.id, false)}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleVerifyPlant(plant.id, true)}
                    disabled={isUpdating}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Verificar
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
