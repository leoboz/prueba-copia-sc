
import React from 'react';
import { FlaskConical, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface StandardsHeaderProps {
  hasValidParameters: boolean;
  hasExistingStandards: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const StandardsHeader: React.FC<StandardsHeaderProps> = ({
  hasValidParameters,
  hasExistingStandards,
  isDialogOpen,
  setIsDialogOpen
}) => {
  return (
    <header className="mb-8">
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-8 w-8" />
            <div>
              <h1 className="text-4xl font-bold font-serif">Estándares de Calidad</h1>
              <p className="text-navy-100 text-lg mt-1">
                {hasExistingStandards 
                  ? 'Gestione y edite los criterios de calidad para diferentes tipos de semillas'
                  : 'Defina los criterios de calidad para diferentes tipos de semillas'
                }
              </p>
            </div>
          </div>
          
          {hasValidParameters && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-navy-900 hover:bg-navy-50 font-medium">
                  <Settings className="mr-2 h-4 w-4" /> 
                  {hasExistingStandards ? 'Gestionar Estándares' : 'Crear Estándares'}
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
};

export default StandardsHeader;
