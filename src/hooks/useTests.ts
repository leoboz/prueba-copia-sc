import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Test, Parameter } from '@/types';

interface UseTestsReturn {
  tests: Test[] | undefined;
  isLoading: boolean;
  error: Error | null;
  createTestTemplate: ReturnType<typeof useMutation>;
  updateTestTemplate: ReturnType<typeof useMutation>;
  getTestWithParameters: (testId: string) => ReturnType<typeof useQuery<Test>>;
  refetch: () => void;
}

export const useTests = (): UseTestsReturn => {
  const queryClient = useQueryClient();

  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      console.log('🔍 Fetching all tests with parameters...');
      
      try {
        const { data, error } = await supabase
          .from('tests')
          .select(`
            id, name, description, created_by, is_template, created_at, updated_at,
            parameters(id, name, type, validation, description, test_id, created_at, updated_at)
          `);
          
        if (error) {
          console.error('❌ Error fetching tests:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.warn('⚠️ No tests found in database');
          return [];
        }
        
        console.log(`✅ Successfully fetched ${data.length} tests:`, data);
        
        // Transform the data to match the Test interface
        const transformedTests = data.map((test: any) => {
          const transformedTest = {
            id: test.id,
            name: test.name,
            description: test.description,
            createdBy: test.created_by,
            isTemplate: test.is_template,
            createdAt: test.created_at,
            updatedAt: test.updated_at,
            parameters: test.parameters?.map((param: any) => ({
              id: param.id,
              name: param.name,
              type: param.type,
              validation: param.validation || { required: false },
              description: param.description,
              testId: param.test_id || test.id,
              createdAt: param.created_at || new Date().toISOString(),
              updatedAt: param.updated_at || new Date().toISOString(),
            })) || [],
          };
          
          console.log(`📋 Test "${test.name}" has ${transformedTest.parameters.length} parameters`);
          return transformedTest;
        });
        
        return transformedTests;
      } catch (error) {
        console.error('💥 Fatal error in tests query:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 min cache
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const getTestWithParameters = useCallback(
    (testId: string) =>
      useQuery<Test>({
        queryKey: ['test', testId],
        queryFn: async () => {
          console.log(`🔍 Fetching test with ID: ${testId}`);
          
          if (!testId) {
            throw new Error('Test ID is required');
          }
          
          try {
            const { data, error } = await supabase
              .from('tests')
              .select(`
                id, name, description, created_by, is_template, created_at, updated_at,
                parameters(id, name, type, validation, description, test_id, created_at, updated_at)
              `)
              .eq('id', testId)
              .single();
              
            if (error) {
              console.error(`❌ Error fetching test ${testId}:`, error);
              throw error;
            }
            
            if (!data) {
              console.error(`❌ Test with ID ${testId} not found`);
              throw new Error(`Test with ID ${testId} not found`);
            }

            const transformedData: Test = {
              id: data.id,
              name: data.name,
              description: data.description,
              createdBy: data.created_by,
              isTemplate: data.is_template,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              parameters: data.parameters?.map((param: any) => ({
                id: param.id,
                name: param.name,
                type: param.type,
                validation: param.validation || { required: false },
                description: param.description,
                testId: param.test_id || data.id,
                createdAt: param.created_at || new Date().toISOString(),
                updatedAt: param.updated_at || new Date().toISOString(),
              })) || [],
            };

            console.log(`✅ Successfully fetched test "${data.name}" with ${transformedData.parameters.length} parameters:`, transformedData);
            return transformedData;
          } catch (error) {
            console.error(`💥 Fatal error fetching test ${testId}:`, error);
            throw error;
          }
        },
        enabled: !!testId,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      }),
    []
  );

  const createTestTemplate = useMutation({
    mutationFn: async ({ test, parameters }: { test: any; parameters: any[] }) => {
      const { data, error } = await supabase.from('tests').insert(test).select().single();
      if (error) throw error;

      if (parameters.length) {
        const { error: paramError } = await supabase
          .from('parameters')
          .insert(parameters.map((param) => ({ ...param, test_id: data.id })));
        if (paramError) throw paramError;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast({ title: 'Éxito', description: 'Plantilla creada' });
    },
    onError: (error: any) => {
      console.error('Create test error:', error);
      toast({ title: 'Error', description: 'No se pudo crear la plantilla', variant: 'destructive' });
    },
  });

  const updateTestTemplate = useMutation({
    mutationFn: async ({ test, parameters }: { test: any; parameters: any[] }) => {
      const { data, error } = await supabase
        .from('tests')
        .update({ name: test.name, description: test.description })
        .eq('id', test.id)
        .select()
        .single();
      if (error) throw error;

      const { data: currentParams, error: fetchError } = await supabase
        .from('parameters')
        .select('id')
        .eq('test_id', test.id);
      if (fetchError) throw fetchError;

      const currentParamIds = currentParams?.map((p) => p.id) || [];
      const newParams = parameters.filter((p) => !p.id);
      const existingParams = parameters.filter((p) => p.id);
      const existingParamIds = existingParams.map((p) => p.id);
      const paramsToDelete = currentParamIds.filter((id) => !existingParamIds.includes(id));

      if (paramsToDelete.length) {
        const { data: referencedParams, error: refError } = await supabase
          .from('test_results')
          .select('parameter_id')
          .in('parameter_id', paramsToDelete);
        if (refError) throw refError;

        const referencedParamIds = referencedParams?.map((r) => r.parameter_id) || [];
        const safeToDelete = paramsToDelete.filter((id) => !referencedParamIds.includes(id));

        if (safeToDelete.length) {
          const { error: deleteError } = await supabase
            .from('parameters')
            .delete()
            .in('id', safeToDelete);
          if (deleteError) throw deleteError;
        }
      }

      for (const param of existingParams) {
        const { error: updateError } = await supabase
          .from('parameters')
          .update({
            name: param.name,
            type: param.type,
            validation: param.validation,
            description: param.description,
          })
          .eq('id', param.id);
        if (updateError) throw updateError;
      }

      if (newParams.length) {
        const { error: insertError } = await supabase
          .from('parameters')
          .insert(newParams.map((param) => ({ ...param, test_id: test.id })));
        if (insertError) throw insertError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast({ title: 'Éxito', description: 'Plantilla actualizada' });
    },
    onError: (error: any) => {
      console.error('Update test error:', error);
      toast({ title: 'Error', description: 'No se pudo actualizar la plantilla', variant: 'destructive' });
    },
  });

  const refetch = () => {
    console.log('🔄 Manually refetching tests...');
    queryClient.invalidateQueries({ queryKey: ['tests'] });
  };

  return { 
    tests, 
    isLoading, 
    error,
    createTestTemplate, 
    updateTestTemplate, 
    getTestWithParameters, 
    refetch 
  };
};
