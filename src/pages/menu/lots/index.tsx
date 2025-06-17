
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MultiplierLotsPage from './multiplier/MultiplierLotsPage';
import GeneticsCompanyLotsPage from './genetics/GeneticsCompanyLotsPage';
import LabLotsPage from './lab/LabLotsPage';
import { Card } from '@/components/ui/card';

const LotsPage: React.FC = () => {
  const { activeRole, isLoading, isSystemAdmin } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark"></div>
        <span className="ml-2 text-countryside-brown">Cargando...</span>
      </div>
    );
  }
  
  // System admins can see all lots (default to multiplier view)
  if (isSystemAdmin) {
    return <MultiplierLotsPage />;
  }
  
  // Render different lots page based on active company role
  switch (activeRole) {
    case 'multiplier':
      return <MultiplierLotsPage />;
    case 'geneticsCompany':
      return <GeneticsCompanyLotsPage />;
    case 'lab':
      return <LabLotsPage />;
    case 'farmer':
      return <MultiplierLotsPage />; // Farmers can see multiplier view
    default:
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-medium text-red-600 mb-4">Sin empresa activa</h2>
            <p className="text-countryside-brown">Por favor seleccione una empresa para continuar.</p>
          </Card>
        </div>
      );
  }
};

export default LotsPage;
