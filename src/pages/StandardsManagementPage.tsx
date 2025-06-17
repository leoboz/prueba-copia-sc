
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStandards } from '@/hooks/useStandards';
import { useSampleLabels } from '@/hooks/useSampleLabels';
import { useParametersForStandards } from '@/hooks/useParametersForStandards';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StandardsTableCreation from '@/components/standards/StandardsTableCreation';
import StandardsHeader from '@/components/standards/StandardsHeader';
import StandardsLoading from '@/components/standards/StandardsLoading';
import NoParametersWarning from '@/components/standards/NoParametersWarning';
import StandardsMainContent from '@/components/standards/StandardsMainContent';

const StandardsManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { standards, isLoading: isLoadingStandards, createStandard, updateStandard } = useStandards();
  const { labels, isLoading: isLoadingLabels } = useSampleLabels();
  const { data: parameters, isLoading: isLoadingParameters } = useParametersForStandards();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    console.log('StandardsManagementPage - user.id:', user?.id);
    console.log('StandardsManagementPage - parameters:', parameters);
    console.log('StandardsManagementPage - standards:', standards);
    console.log('StandardsManagementPage - labels:', labels);
  }, [parameters, standards, labels, user]);

  const handleCreateStandards = async (standardsData: any[]) => {
    try {
      console.log('Creating multiple standards:', standardsData);
      
      for (const standardData of standardsData) {
        await createStandard.mutateAsync({
          testId: standardData.testId,
          parameterId: standardData.parameterId,
          labelId: standardData.labelId,
          criteria: standardData.criteria,
          createdBy: user?.id || ''
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating standards:', error);
    }
  };

  const handleUpdateStandard = async (standardId: string, criteria: any) => {
    try {
      console.log('Updating standard:', standardId, criteria);
      await updateStandard.mutateAsync({
        standardId,
        criteria
      });
    } catch (error) {
      console.error('Error updating standard:', error);
    }
  };

  if (isLoadingStandards || isLoadingLabels || isLoadingParameters) {
    return <StandardsLoading />;
  }

  const hasValidParameters = parameters && parameters.length > 0;
  const hasExistingStandards = parameters && parameters.some(param => param.existingStandards && Object.keys(param.existingStandards).length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-7xl mx-auto">
        <StandardsHeader
          hasValidParameters={hasValidParameters}
          hasExistingStandards={hasExistingStandards}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />

        {!hasValidParameters && <NoParametersWarning />}

        {hasValidParameters && (
          <StandardsMainContent
            parameters={parameters || []}
            labels={labels || []}
            hasExistingStandards={hasExistingStandards}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-navy-800 font-serif">
                {hasExistingStandards ? 'Gestionar Estándares de Calidad' : 'Crear Estándares de Calidad'}
              </DialogTitle>
              <DialogDescription>
                {hasExistingStandards 
                  ? 'Edite los rangos existentes o configure nuevos estándares para los parámetros disponibles.'
                  : 'Configure los rangos de valores para cada parámetro según las etiquetas de calidad.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <StandardsTableCreation 
              parameters={parameters || []}
              labels={labels || []}
              onSubmit={handleCreateStandards}
              onUpdate={handleUpdateStandard}
              isLoading={createStandard.isPending || updateStandard.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StandardsManagementPage;
