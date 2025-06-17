
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Factory } from 'lucide-react';

const plantSchema = z.object({
  name: z.string().min(1, 'El nombre de la planta es requerido'),
});

type PlantFormData = z.infer<typeof plantSchema>;

interface CreatePlantModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading: boolean;
}

export const CreatePlantModal = ({ isOpen, onOpenChange, onSubmit, isLoading }: CreatePlantModalProps) => {
  const form = useForm<PlantFormData>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = async (data: PlantFormData) => {
    try {
      // Ensure name is a string (it will be due to Zod validation)
      await onSubmit({ name: data.name });
      form.reset();
    } catch (error) {
      console.error('Error creating plant:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Factory className="h-5 w-5 mr-2 text-navy-700" />
            Nueva Planta de Producción
          </DialogTitle>
          <DialogDescription>
            Agregue una nueva planta de producción. Será enviada para verificación por la empresa genética.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Planta</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese el nombre de la planta de producción" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Creando...' : 'Crear Planta'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
