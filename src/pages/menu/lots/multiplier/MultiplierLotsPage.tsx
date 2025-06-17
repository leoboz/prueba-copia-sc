
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLots } from '@/hooks/useLots';
import { useSamples } from '@/hooks/useSamples';
import { useUsers } from '@/hooks/useUsers';
import { useTests } from '@/hooks/useTests';
import { useSampleTypes } from '@/hooks/useSampleTypes';
import { useParameterLabels } from '@/hooks/useParameterLabels';
import { Sample } from '@/types';
import { toast } from '@/hooks/use-toast';
import LotsList from '@/components/lots/LotsList';
import SampleCreationModal from '@/components/lots/SampleCreationModal';
import MultiplierLotsHeader from '@/components/lots/multiplier/MultiplierLotsHeader';
import MultiplierLotsSearch from '@/components/lots/multiplier/MultiplierLotsSearch';

const MultiplierLotsPage: React.FC = () => {
  const { user } = useAuth();
  const { multiplierLots, isLoadingMultiplierLots } = useLots();
  const { createSample } = useSamples();
  const { labs } = useUsers();
  const { tests } = useTests();
  const { sampleTypes } = useSampleTypes();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);

  // Filter lots based on search query
  const filteredLots = multiplierLots?.filter(lot => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      lot.code.toLowerCase().includes(searchLower) ||
      lot.variety?.name?.toLowerCase().includes(searchLower) ||
      lot.variety?.crop?.name?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Get sample IDs for all lots to fetch parameter labels
  const allSampleIds = filteredLots.flatMap(lot => 
    lot.samples?.map(sample => sample.id) || []
  );
  
  const { data: parameterLabels } = useParameterLabels(allSampleIds);

  // Create lot labels mapping for parameter display
  const lotLabels = filteredLots.reduce((acc, lot) => {
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

    acc[lot.id] = {
      combined: combinedLabel,
      individual: lotParameterLabels.map(label => ({
        parameter: label.parameter || '',
        label: label.label || ''
      }))
    };
    
    return acc;
  }, {} as Record<string, { combined: string; individual: { parameter: string; label: string }[] }>);

  const handleCreateSample = (lotId: string) => {
    console.log('🎯 Creating sample for lot:', lotId);
    console.log('Available labs:', labs?.map(lab => ({ id: lab.id, name: lab.name, email: lab.email })));
    
    if (!labs || labs.length === 0) {
      toast({
        title: "No hay laboratorios disponibles",
        description: "No se pueden crear muestras sin laboratorios registrados.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedLotId(lotId);
    setIsSampleModalOpen(true);
  };

  const handleSampleSubmit = async (sampleData: Omit<Sample, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🚀 MultiplierLotsPage: Submitting sample data:', sampleData);
      console.log('🔍 Sample will be assigned to lab user ID:', sampleData.userId);
      
      // Verify that the userId is actually a lab user
      const assignedLab = labs?.find(lab => lab.id === sampleData.userId);
      if (!assignedLab) {
        throw new Error('El laboratorio seleccionado no es válido');
      }
      
      console.log('✅ Sample assigned to lab:', assignedLab);
      
      await createSample.mutateAsync(sampleData);
      
      toast({
        title: "Muestra creada exitosamente",
        description: `La muestra ha sido asignada al laboratorio ${assignedLab.name}`,
      });
      
      setIsSampleModalOpen(false);
      setSelectedLotId(null);
    } catch (error: any) {
      console.error('❌ Error creating sample in MultiplierLotsPage:', error);
      
      toast({
        title: "Error al crear muestra",
        description: error.message || "No se pudo crear la muestra. Verifique los datos e intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <MultiplierLotsHeader />
        
        <MultiplierLotsSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <LotsList
          isLoading={isLoadingMultiplierLots}
          filteredLots={filteredLots}
          lotLabels={lotLabels}
          onCreateSample={handleCreateSample}
          onClearFilters={handleClearFilters}
        />

        <SampleCreationModal
          isOpen={isSampleModalOpen}
          onOpenChange={setIsSampleModalOpen}
          selectedLotId={selectedLotId}
          onSubmit={handleSampleSubmit}
          labs={labs || []}
          tests={tests || []}
          sampleTypes={sampleTypes || []}
          isLoading={createSample.isPending}
        />
      </div>
    </div>
  );
};

export default MultiplierLotsPage;
