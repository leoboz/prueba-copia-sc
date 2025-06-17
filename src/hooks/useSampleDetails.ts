import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sample, SampleStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useSampleDetails = () => {
  const queryClient = useQueryClient();

  const getSampleById = async (sampleId: string) => {
    try {
      console.log('Fetching sample by ID:', sampleId);
      const { data, error } = await supabase
        .from('samples')
        .select(`
          id,
          lot_id,
          user_id,
          test_ids,
          status,
          estimated_result_date,
          created_at,
          updated_at,
          sample_type_id,
          internal_code,
          label_id,
          lot:lots(
            code,
            user_id:users(id, name, email),
            variety:varieties(name, crop:crops(name))
          )
        `)
        .eq('id', sampleId)
        .single();

      if (error) {
        console.error('Sample fetch error:', error.message, error);
        throw error;
      }

      console.log('Fetched sample details:', data);

      return {
        id: data.id,
        lotId: data.lot_id,
        userId: data.user_id,
        testIds: data.test_ids,
        status: data.status,
        sampleTypeId: data.sample_type_id,
        internal_code: data.internal_code,
        labelId: data.label_id,
        estimatedResultDate: data.estimated_result_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        lot: data.lot ? {
          code: data.lot.code,
          user: data.lot.user_id || { id: '', name: 'N/A', email: '' },
          variety: data.lot.variety
        } : null,
      } as Sample;
    } catch (error) {
      console.error('Error fetching sample details:', error);
      throw error;
    }
  };

  const updateSampleStatus = useMutation({
    mutationFn: async ({
      sampleId,
      status,
      estimatedResultDate
    }: {
      sampleId: string;
      status: SampleStatus;
      estimatedResultDate?: string;
    }) => {
      console.log('Updating sample status:', { sampleId, status, estimatedResultDate });
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (estimatedResultDate) {
        updateData.estimated_result_date = estimatedResultDate;
      }

      const { data, error } = await supabase
        .from('samples')
        .update(updateData)
        .eq('id', sampleId)
        .select()
        .single();

      if (error) {
        console.error('Update sample status error:', error.message, error);
        throw error;
      }

      // Log security event
      try {
        await supabase.rpc('log_security_event', {
          p_action: 'update_sample_status',
          p_table_name: 'samples',
          p_record_id: data.id,
          p_details: { new_status: status }
        });
      } catch (logError) {
        console.warn('Failed to log security event:', logError);
      }

      console.log('Sample status updated:', data);

      return {
        id: data.id,
        lotId: data.lot_id,
        userId: data.user_id,
        testIds: data.test_ids,
        status: data.status,
        sampleTypeId: data.sample_type_id,
        internal_code: data.internal_code,
        labelId: data.label_id,
        estimatedResultDate: data.estimated_result_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        lot: null
      } as Sample;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samples'] });
    },
  });

  const createSample = useMutation({
    mutationFn: async (sampleData: Omit<Sample, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('🚀 Creating sample with data:', sampleData);

      // Enhanced validation with better error messages
      if (!sampleData.lotId) {
        const error = new Error('El ID del lote es requerido');
        console.error('❌ Validation failed:', error.message);
        throw error;
      }
      if (!sampleData.userId) {
        const error = new Error('Debe seleccionar un laboratorio para asignar la muestra');
        console.error('❌ Validation failed:', error.message);
        throw error;
      }
      if (!sampleData.testIds || sampleData.testIds.length === 0) {
        const error = new Error('Debe seleccionar al menos una prueba');
        console.error('❌ Validation failed:', error.message);
        throw error;
      }
      if (!sampleData.sampleTypeId) {
        const error = new Error('Debe seleccionar un tipo de muestra');
        console.error('❌ Validation failed:', error.message);
        throw error;
      }
      if (!sampleData.status || !['submitted', 'received', 'testing', 'completed'].includes(sampleData.status)) {
        const error = new Error('Estado de muestra inválido');
        console.error('❌ Validation failed:', error.message);
        throw error;
      }

      console.log('✅ Validation passed, inserting sample into database...');

      const insertData = {
        lot_id: sampleData.lotId,
        user_id: sampleData.userId, // This is the lab user ID who will analyze the sample
        test_ids: sampleData.testIds,
        status: sampleData.status,
        sample_type_id: sampleData.sampleTypeId,
        estimated_result_date: sampleData.estimatedResultDate,
        internal_code: sampleData.internal_code,
      };

      console.log('📤 Insert data:', insertData);
      console.log('🎯 Sample will be assigned to lab user:', sampleData.userId);

      const { data, error } = await supabase
        .from('samples')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Create sample error:', error.message, error);
        
        // Provide more specific error messages for common RLS issues
        if (error.message.includes('row-level security policy')) {
          throw new Error('No tiene permisos para crear muestras para este lote. Verifique que sea el propietario del lote.');
        }
        
        if (error.message.includes('foreign key')) {
          throw new Error('Los datos seleccionados no son válidos. Verifique el laboratorio, tipo de muestra y pruebas seleccionadas.');
        }
        
        throw new Error(`Error al crear muestra: ${error.message}`);
      }

      console.log('✅ Sample created successfully:', data);
      console.log('🎉 Sample assigned to lab user:', data.user_id);

      // Log security event
      try {
        await supabase.rpc('log_security_event', {
          p_action: 'create_sample',
          p_table_name: 'samples',
          p_record_id: data.id,
          p_details: { 
            lot_id: data.lot_id,
            assigned_to_lab: data.user_id
          }
        });
      } catch (logError) {
        console.warn('⚠️ Failed to log security event:', logError);
      }

      return {
        id: data.id,
        lotId: data.lot_id,
        userId: data.user_id,
        testIds: data.test_ids,
        status: data.status,
        sampleTypeId: data.sample_type_id,
        internal_code: data.internal_code,
        estimatedResultDate: data.estimated_result_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Sample;
    },
    onSuccess: (data) => {
      console.log('🎉 Sample creation mutation succeeded:', data.id);
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      toast({
        title: "Muestra creada",
        description: `La muestra ${data.internal_code || data.id} ha sido creada y asignada al laboratorio exitosamente.`,
      });
    },
    onError: (error: any) => {
      console.error('💥 Create sample mutation error:', error);
      toast({
        title: "Error al crear muestra",
        description: error.message || "No se pudo crear la muestra. Verifique los datos e intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    getSampleById,
    updateSampleStatus,
    createSample,
  };
};
