
import React from 'react';

const StandardsLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-700"></div>
        <span className="ml-2 text-navy-800">Cargando datos...</span>
      </div>
    </div>
  );
};

export default StandardsLoading;
