
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, FlaskConical } from 'lucide-react';
import StandardsStatistics from './StandardsStatistics';
import ExistingStandardsList from './ExistingStandardsList';

interface Parameter {
  id: string;
  name: string;
  existingStandards?: {
    [labelName: string]: {
      standardId: string;
      min: number;
      max: number;
    };
  };
}

interface StandardsMainContentProps {
  parameters: Parameter[];
  labels: Array<{ id: string; name: string; description?: string }>;
  hasExistingStandards: boolean;
}

const StandardsMainContent: React.FC<StandardsMainContentProps> = ({
  parameters,
  labels,
  hasExistingStandards
}) => {
  const standardsCount = parameters.filter(
    p => p.existingStandards && Object.keys(p.existingStandards).length > 0
  ).length;

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-navy-200 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-navy-800 flex items-center gap-2 font-serif">
            <Settings className="h-5 w-5 text-navy-700" />
            {hasExistingStandards ? 'Estándares Configurados' : 'Configurar Estándares'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-navy-700">
              {hasExistingStandards 
                ? 'Haga clic en "Gestionar Estándares" para editar los rangos existentes o agregar nuevos estándares.'
                : 'Haga clic en "Crear Estándares" para abrir la interfaz de configuración.'
              }
            </p>
            
            <StandardsStatistics
              parametersCount={parameters.length}
              standardsCount={standardsCount}
              labelsCount={labels?.length || 0}
              hasExistingStandards={hasExistingStandards}
            />

            <ExistingStandardsList parameters={parameters} />
          </div>
        </CardContent>
      </Card>

      {!hasExistingStandards && (
        <div className="text-center py-16">
          <div className="mx-auto bg-navy-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <FlaskConical className="h-10 w-10 text-navy-700" />
          </div>
          <h3 className="text-2xl font-serif text-navy-800 mb-4">
            Listo para crear estándares
          </h3>
          <p className="text-navy-700 max-w-md mx-auto text-lg">
            Configure los rangos de calidad para sus parámetros y comience a clasificar automáticamente sus muestras.
          </p>
        </div>
      )}
    </div>
  );
};

export default StandardsMainContent;
