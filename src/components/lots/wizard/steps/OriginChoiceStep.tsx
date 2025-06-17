
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Copy } from 'lucide-react';

interface OriginChoiceStepProps {
  onChoice: (hasOrigin: boolean) => void;
}

export const OriginChoiceStep: React.FC<OriginChoiceStepProps> = ({
  onChoice
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-navy-900 mb-2">
          ¿Cómo desea crear este lote?
        </h2>
        <p className="text-navy-600">
          Puede crear un lote completamente nuevo o heredar datos de un lote existente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card
          className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 group"
          onClick={() => onChoice(false)}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-navy-900 mb-3">
              Crear Nuevo
            </h3>
            
            <p className="text-navy-600 mb-6">
              Complete todos los datos manualmente para crear un lote desde cero
            </p>
            
            <div className="text-sm text-navy-500">
              Ideal para lotes únicos o cuando no hay lotes de referencia
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 group"
          onClick={() => onChoice(true)}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-countryside-green to-countryside-green-dark rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Copy className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-navy-900 mb-3">
              Heredar de Existente
            </h3>
            
            <p className="text-navy-600 mb-6">
              Seleccione un lote existente y herede automáticamente sus datos principales
            </p>
            
            <div className="text-sm text-navy-500">
              Ahorra tiempo al mantener consistencia con lotes relacionados
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
