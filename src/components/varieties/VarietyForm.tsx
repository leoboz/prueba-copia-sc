
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Crop, Technology } from '@/types';

interface VarietyFormProps {
  formData: {
    name: string;
    description: string;
    cropId: string;
    technologyId: string;
  };
  setFormData: (data: any) => void;
  crops?: Crop[];
  technologies?: Technology[];
  isLoadingCrops: boolean;
  isLoadingTechnologies: boolean;
}

const VarietyForm: React.FC<VarietyFormProps> = ({
  formData,
  setFormData,
  crops,
  technologies,
  isLoadingCrops,
  isLoadingTechnologies,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-navy-700 font-medium">
            Nombre de la Variedad *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Variedad Premium V1"
            required
            className="border-navy-200 focus:border-navy-500 focus:ring-navy-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cropId" className="text-navy-700 font-medium">
            Cultivo *
          </Label>
          <Select
            value={formData.cropId}
            onValueChange={(value) => setFormData({ ...formData, cropId: value })}
            disabled={isLoadingCrops}
          >
            <SelectTrigger className="border-navy-200 focus:border-navy-500 focus:ring-navy-500">
              <SelectValue placeholder="Seleccionar cultivo" />
            </SelectTrigger>
            <SelectContent>
              {crops?.map((crop) => (
                <SelectItem key={crop.id} value={crop.id}>
                  {crop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologyId" className="text-navy-700 font-medium">
          Tecnología (opcional)
        </Label>
        <Select
          value={formData.technologyId}
          onValueChange={(value) => setFormData({ ...formData, technologyId: value })}
          disabled={isLoadingTechnologies}
        >
          <SelectTrigger className="border-navy-200 focus:border-navy-500 focus:ring-navy-500">
            <SelectValue placeholder="Seleccionar tecnología" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin tecnología</SelectItem>
            {technologies?.map((technology) => (
              <SelectItem key={technology.id} value={technology.id}>
                {technology.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-navy-700 font-medium">
          Descripción
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción detallada de la variedad, características especiales, ventajas, etc."
          rows={4}
          className="border-navy-200 focus:border-navy-500 focus:ring-navy-500"
        />
      </div>
    </div>
  );
};

export default VarietyForm;
