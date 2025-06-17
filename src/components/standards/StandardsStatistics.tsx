
import React from 'react';

interface StandardsStatisticsProps {
  parametersCount: number;
  standardsCount: number;
  labelsCount: number;
  hasExistingStandards: boolean;
}

const StandardsStatistics: React.FC<StandardsStatisticsProps> = ({
  parametersCount,
  standardsCount,
  labelsCount,
  hasExistingStandards
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="bg-navy-50 p-4 rounded-lg border border-navy-200">
        <span className="font-medium text-navy-700">Parámetros disponibles:</span>
        <div className="text-2xl font-bold text-navy-900 mt-1">{parametersCount}</div>
      </div>
      
      {hasExistingStandards && (
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <span className="font-medium text-emerald-800">Con estándares:</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{standardsCount}</div>
        </div>
      )}
      
      <div className="bg-navy-100 p-4 rounded-lg border border-navy-300">
        <span className="font-medium text-navy-800">Etiquetas de calidad:</span>
        <div className="text-2xl font-bold text-navy-900 mt-1">{labelsCount}</div>
      </div>
    </div>
  );
};

export default StandardsStatistics;
