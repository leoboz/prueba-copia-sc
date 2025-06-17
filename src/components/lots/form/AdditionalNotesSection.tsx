
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { LotFormData } from './types';

interface AdditionalNotesSectionProps {
  form: UseFormReturn<LotFormData>;
}

const AdditionalNotesSection: React.FC<AdditionalNotesSectionProps> = ({
  form,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas Adicionales</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Información adicional sobre el lote..." 
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AdditionalNotesSection;
