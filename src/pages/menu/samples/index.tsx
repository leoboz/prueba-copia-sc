
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import LabSamplesPage from './lab/LabSamplesPage';
import MultiplierSamplesPage from './multiplier/MultiplierSamplesPage';
import { Card } from '@/components/ui/card';

const SamplesPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark"></div>
        <span className="ml-2 text-countryside-brown">Cargando...</span>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-medium text-red-600 mb-4">Acceso denegado</h2>
          <p className="text-countryside-brown">Debe iniciar sesión para acceder a esta página.</p>
        </Card>
      </div>
    );
  }
  
  switch (user.role) {
    case 'lab':
      return <LabSamplesPage />;
    case 'multiplier':
      return <MultiplierSamplesPage />;
    case 'admin':
      // Admin can see all samples - we'll show the lab view for admins
      return <LabSamplesPage />;
    default:
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-medium text-red-600 mb-4">Acceso denegado</h2>
          <p className="text-countryside-brown">Su rol no tiene permisos para acceder a esta página.</p>
        </Card>
      </div>
    );
  }
};

export default SamplesPage;
