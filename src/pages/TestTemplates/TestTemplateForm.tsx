
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

// Parameter type options - Updated to match database constraints
const parameterTypes = [
  { value: 'numeric', label: 'Número' },
  { value: 'range', label: 'Rango' },
  { value: 'boolean', label: 'Si/No' },
  { value: 'select', label: 'Selección' },
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número Exacto' },
];

// Validation schema for test template
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  description: z.string().optional(),
  parameters: z.array(
    z.object({
      name: z.string().min(2, {
        message: "El nombre del parámetro debe tener al menos 2 caracteres.",
      }),
      description: z.string().optional(),
      type: z.string().min(1, {
        message: "Debe seleccionar un tipo.",
      }),
      validation: z.object({
        required: z.boolean().default(false),
        min: z.number().optional(),
        max: z.number().optional(),
      }).optional().default({}),
    })
  ).min(1, {
    message: "Debe agregar al menos un parámetro.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface TestTemplateFormProps {
  onSubmit: (data: FormValues) => void;
  initialData?: Partial<FormValues>;
  isEditing?: boolean;
}

const TestTemplateForm: React.FC<TestTemplateFormProps> = ({ 
  onSubmit, 
  initialData = { parameters: [] }, 
  isEditing = false 
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || '',
      parameters: initialData.parameters?.length 
        ? initialData.parameters 
        : [{ name: '', description: '', type: '', validation: { required: false } }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: "parameters",
    control: form.control,
  });

  const handleAddParameter = () => {
    append({ 
      name: '', 
      description: '', 
      type: '', 
      validation: { required: false } 
    });
  };

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Plantilla</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción de la plantilla" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base">Parámetros</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddParameter}
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar Parámetro
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="bg-countryside-cream/20">
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Parámetro #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={fields.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`parameters.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Pureza" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`parameters.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parameterTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`parameters.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descripción del parámetro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`parameters.${index}.validation.required`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 text-countryside-green focus:ring-countryside-green border-countryside-brown/30 rounded"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Obligatorio</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {(form.watch(`parameters.${index}.type`) === 'numeric' || 
                    form.watch(`parameters.${index}.type`) === 'range' ||
                    form.watch(`parameters.${index}.type`) === 'number') && (
                    <div className="grid grid-cols-2 gap-2 col-span-2">
                      <FormField
                        control={form.control}
                        name={`parameters.${index}.validation.min`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Mínimo</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Mínimo"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`parameters.${index}.validation.max`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Máximo</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Máximo"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {form.formState.errors.parameters && !Array.isArray(form.formState.errors.parameters) && (
            <p className="text-sm font-medium text-red-500">
              {form.formState.errors.parameters.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">
            {isEditing ? 'Actualizar Plantilla' : 'Crear Plantilla'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TestTemplateForm;
