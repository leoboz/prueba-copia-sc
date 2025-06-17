
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

const NoParametersWarning: React.FC = () => {
  return (
    <Card className="border-amber-200 bg-amber-50 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-800">
              No hay parámetros válidos disponibles
            </h3>
            <p className="text-amber-700 text-sm mt-1">
              Para crear estándares, necesita tests con exactamente un parámetro cada uno. 
              Por favor, cree o modifique sus tests para cumplir este requisito.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoParametersWarning;
