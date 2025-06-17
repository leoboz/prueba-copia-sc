
import React, { useState } from 'react';
import { Sample } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, FlaskConical } from 'lucide-react';
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface StatusActionsProps {
  sample: Sample;
  userRole: 'multiplier' | 'lab';
  onStatusUpdate: (sampleId: string, status: Sample['status'], estimatedResultDate?: string) => Promise<void>;
}

const StatusActions: React.FC<StatusActionsProps> = ({ sample, userRole, onStatusUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [estimatedDate, setEstimatedDate] = useState(sample.estimatedResultDate || '');

  if (userRole !== 'lab') return null;

  const handleConfirm = async () => {
    if (!estimatedDate) return;
    
    try {
      await onStatusUpdate(sample.id, 'confirmed', estimatedDate);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  switch (sample.status) {
    case 'submitted':
      return (
        <Button 
          size="sm"
          className="mt-4 bg-countryside-amber text-countryside-soil hover:bg-countryside-amber-dark"
          onClick={() => onStatusUpdate(sample.id, 'received')}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Marcar como Recibida
        </Button>
      );
      
    case 'received':
      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm"
              className="mt-4 bg-countryside-amber text-countryside-soil hover:bg-countryside-amber-dark"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Confirmar y Programar Análisis
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Muestra</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <label className="block text-sm font-medium mb-2">
                Fecha Estimada para Resultados
              </label>
              <input
                type="date"
                value={estimatedDate}
                onChange={(e) => setEstimatedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-countryside-green hover:bg-countryside-green-dark"
                onClick={handleConfirm}
                disabled={!estimatedDate}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
      
    case 'confirmed':
      return (
        <Button 
          size="sm"
          className="mt-4 bg-countryside-green hover:bg-countryside-green-dark"
          onClick={() => onStatusUpdate(sample.id, 'testing')}
        >
          <FlaskConical className="mr-2 h-4 w-4" />
          Iniciar Análisis
        </Button>
      );
      
    default:
      return null;
  }
};

export default StatusActions;
