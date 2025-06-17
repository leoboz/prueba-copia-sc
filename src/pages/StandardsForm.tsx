import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  testId: z.string().min(1, 'Seleccione una prueba'),
  parameterId: z.string().min(1, 'Seleccione un parámetro'),
  labelId: z.string().min(1, 'Seleccione una etiqueta'),
  criteria: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).refine(data => data.min !== undefined || data.max !== undefined, {
    message: 'Defina al menos un criterio (mínimo o máximo)',
  }),
});

interface StandardsFormProps {
  tests: any[];
  labels: { id: string; name: string }[];
  onSubmit: (data: any) => Promise<void>;
}

const StandardsForm: React.FC<StandardsFormProps> = ({ tests, labels, onSubmit }) => {
  const [parameters, setParameters] = useState<any[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testId: '',
      parameterId: '',
      labelId: labels?.[0]?.id || '',
      criteria: { min: undefined, max: undefined },
    },
  });

  useEffect(() => {
    console.log('StandardsForm props - tests:', tests, 'labels:', labels);
    console.log('Test ids available:', tests.map(test => test.id));
  }, [tests, labels]);

  const handleTestChange = (testId: string) => {
    console.log('Selected testId:', testId);
    const selectedTest = tests.find(test => test.id === testId);
    const testParameters = selectedTest?.parameters || [];
    console.log('Selected test:', selectedTest);
    console.log('Parameters for test:', testParameters);
    setParameters(testParameters);
    form.setValue('parameterId', '');
  };

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Submitting standard:', values);
    await onSubmit({
      testId: values.testId,
      parameterId: values.parameterId,
      labelId: values.labelId,
      criteria: {
        min: values.criteria.min,
        max: values.criteria.max,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="testId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prueba</FormLabel>
              <Select onValueChange={(value) => { field.onChange(value); handleTestChange(value); }} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una prueba" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tests.length > 0 ? (
                    tests.map(test => (
                      <SelectItem key={test.id} value={test.id}>{test.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-tests" disabled>No hay pruebas disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parameterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parámetro</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un parámetro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parameters.length > 0 ? (
                    parameters.map(param => (
                      <SelectItem key={param.id} value={param.id}>{param.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-parameters" disabled>No hay parámetros disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="labelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiqueta</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una etiqueta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {labels.length > 0 ? (
                    labels.map(label => (
                      <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-labels" disabled>No hay etiquetas disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="criteria.min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Mínimo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="criteria.max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Máximo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-countryside-green hover:bg-countryside-green-dark">
          Crear Estándar
        </Button>
      </form>
    </Form>
  );
};

export default StandardsForm;