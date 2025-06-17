
import React from 'react';

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

interface ExistingStandardsListProps {
  parameters: Parameter[];
}

const ExistingStandardsList: React.FC<ExistingStandardsListProps> = ({ parameters }) => {
  const parametersWithStandards = parameters.filter(
    p => p.existingStandards && Object.keys(p.existingStandards).length > 0
  );

  if (parametersWithStandards.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium text-navy-800 mb-3">Parámetros con estándares configurados:</h4>
      <div className="flex flex-wrap gap-2">
        {parametersWithStandards.map(param => (
          <span key={param.id} className="px-3 py-1 bg-navy-100 text-navy-800 rounded-full text-sm font-medium">
            {param.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ExistingStandardsList;
