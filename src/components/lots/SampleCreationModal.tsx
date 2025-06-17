
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sample } from '@/types';
import SampleForm from '@/components/samples/SampleForm';

interface SampleCreationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedLotId: string | null;
  onSubmit: (sampleData: Omit<Sample, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  labs: any[];
  tests: any[];
  sampleTypes: any[];
  isLoading: boolean;
}

const SampleCreationModal: React.FC<SampleCreationModalProps> = ({
  isOpen,
  onOpenChange,
  selectedLotId,
  onSubmit,
  labs,
  tests,
  sampleTypes,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="create-sample-description">
        <DialogHeader>
          <DialogTitle>Crear Nueva Muestra</DialogTitle>
          <DialogDescription id="create-sample-description">
            Complete los detalles para crear una nueva muestra para análisis.
          </DialogDescription>
        </DialogHeader>
        {selectedLotId && labs && tests && sampleTypes ? (
          <SampleForm
            onSubmit={onSubmit}
            lotId={selectedLotId}
            labs={labs}
            tests={tests}
            sampleTypes={sampleTypes}
            userRole="multiplier"
          />
        ) : (
          <p className="text-countryside-brown">Cargando datos del formulario...</p>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SampleCreationModal;
