import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sample, SampleStatus } from '@/types';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

interface SampleFormProps {
  onSubmit: (sampleData: Omit<Sample, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  lotId: string;
  labs: { id: string; name: string; email: string }[];
  tests: { id: string; name: string }[];
  sampleTypes: { id: string; name: string }[];
  userRole?: 'multiplier' | 'lab';
  initialSample?: Partial<Sample>;
}

const SampleForm: React.FC<SampleFormProps> = ({ 
  onSubmit, 
  lotId, 
  labs, 
  tests, 
  sampleTypes, 
  userRole = 'multiplier',
  initialSample
}) => {
  const { user } = useAuth();
  
  // For multipliers, default to first lab user. For labs, use current user.
  const [userId, setUserId] = useState<string>(
    initialSample?.userId || 
    (userRole === 'multiplier' ? (labs[0]?.id || '') : user?.id || '')
  );
  const [testId, setTestId] = useState<string>(initialSample?.testIds?.[0] || '');
  const [internalCode, setInternalCode] = useState<string>(initialSample?.internal_code || '');
  const [status, setStatus] = useState<SampleStatus>(
    initialSample?.status || (userRole === 'multiplier' ? 'submitted' : 'received')
  );
  const [sampleTypeId, setSampleTypeId] = useState<string>(
    initialSample?.sampleTypeId || (sampleTypes[0]?.id || '')
  );
  const [estimatedResultDate, setEstimatedResultDate] = useState<string>(
    initialSample?.estimatedResultDate || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('🔧 SampleForm debug:', {
    userRole,
    currentUserId: user?.id,
    selectedUserId: userId,
    lotId,
    labs: labs.length,
    tests: tests.length,
    sampleTypes: sampleTypes.length,
    availableLabs: labs.map(lab => ({ id: lab.id, name: lab.name, email: lab.email }))
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!testId || !sampleTypeId || !userId) {
      console.error('❌ Missing required fields:', { testId, sampleTypeId, userId });
      return;
    }

    // Additional validation for multipliers - ensure they're assigning to a lab user
    if (userRole === 'multiplier' && userId === user?.id) {
      console.error('❌ Multiplier cannot assign sample to themselves. Must assign to lab user.');
      return;
    }

    // Verify that the selected user is actually a lab user when multiplier is creating
    if (userRole === 'multiplier') {
      const selectedLab = labs.find(lab => lab.id === userId);
      if (!selectedLab) {
        console.error('❌ Selected user is not a valid lab user:', userId);
        return;
      }
      console.log('✅ Sample will be assigned to lab user:', selectedLab);
    }

    console.log('📤 Submitting sample with data:', {
      lotId,
      userId, // This should be the lab user ID
      testIds: [testId],
      internal_code: internalCode || undefined,
      status,
      sampleTypeId,
      estimatedResultDate: estimatedResultDate || undefined,
      createdByMultiplier: userRole === 'multiplier' ? user?.id : undefined,
      note: userRole === 'multiplier' ? `Created by multiplier ${user?.name || user?.email}` : undefined
    });

    setIsSubmitting(true);
    try {
      await onSubmit({
        lotId,
        userId, // Lab user who will perform the analysis
        testIds: [testId],
        internal_code: internalCode || undefined,
        status,
        sampleTypeId,
        estimatedResultDate: estimatedResultDate || undefined,
      });
      console.log('✅ Sample submitted successfully - assigned to lab user:', userId);
    } catch (error) {
      console.error('❌ Error submitting sample:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {userRole === 'multiplier' && (
        <div>
          <Label className="text-sm font-medium">Asignar a Laboratorio</Label>
          <Select value={userId} onValueChange={setUserId} disabled={initialSample?.userId !== undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un laboratorio" />
            </SelectTrigger>
            <SelectContent>
              {labs.map((lab) => (
                <SelectItem key={lab.id} value={lab.id}>
                  {lab.name} ({lab.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {labs.length === 0 && (
            <p className="text-sm text-red-500 mt-1">No hay laboratorios disponibles</p>
          )}
          <p className="text-xs text-gray-600 mt-1">
            La muestra será asignada al laboratorio seleccionado para análisis
          </p>
        </div>
      )}

      {userRole === 'lab' && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <Label className="text-sm font-medium text-blue-800">Laboratorio Asignado</Label>
          <p className="text-sm text-blue-600 mt-1">
            {user?.name || user?.email || 'Usuario actual'}
          </p>
        </div>
      )}

      <div>
        <Label className="text-sm font-medium">Código Interno de Muestra</Label>
        <Input
          type="text"
          value={internalCode}
          onChange={(e) => setInternalCode(e.target.value)}
          placeholder="Ingrese código interno (opcional)"
          disabled={initialSample?.internal_code !== undefined}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Tipo de Muestra</Label>
        <Select 
          value={sampleTypeId} 
          onValueChange={setSampleTypeId}
          disabled={initialSample?.sampleTypeId !== undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un tipo" />
          </SelectTrigger>
          <SelectContent>
            {sampleTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {sampleTypes.length === 0 && (
          <p className="text-sm text-red-500 mt-1">No hay tipos de muestra disponibles</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Prueba</Label>
        <Select
          value={testId}
          onValueChange={setTestId}
          disabled={initialSample?.testIds !== undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una prueba" />
          </SelectTrigger>
          <SelectContent>
            {tests.map((test) => (
              <SelectItem key={test.id} value={test.id}>
                {test.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {tests.length === 0 && (
          <p className="text-sm text-red-500 mt-1">No hay pruebas disponibles</p>
        )}
      </div>

      {userRole === 'lab' && (
        <div>
          <Label className="text-sm font-medium">Estado</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as SampleStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="received">Recibida</SelectItem>
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="testing">En Análisis</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {(userRole === 'lab' || status === 'confirmed') && (
        <div>
          <Label className="text-sm font-medium">
            {status === 'confirmed' ? 'Fecha Estimada de Resultado' : 'Fecha Estimada de Resultado (opcional)'}
          </Label>
          <Input
            type="date"
            value={estimatedResultDate}
            onChange={(e) => setEstimatedResultDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required={status === 'confirmed'}
          />
        </div>
      )}

      <Button
        type="submit"
        className="bg-countryside-green hover:bg-countryside-green-dark w-full"
        disabled={isSubmitting || !testId || !sampleTypeId || !userId}
      >
        {isSubmitting ? 'Enviando...' : initialSample ? 'Actualizar Muestra' : 'Crear Muestra'}
      </Button>
    </form>
  );
};

export default SampleForm;
