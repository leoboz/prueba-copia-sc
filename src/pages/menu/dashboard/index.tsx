
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import GeneticsCompanyDashboard from './GeneticsCompanyDashboard';
import LabDashboard from './LabDashboard';
import AdminDashboard from './AdminDashboard';
import FarmerDashboard from './FarmerDashboard';
import MultiplierDashboard from './MultiplierDashboard';
import { Card } from '@/components/ui/card';

const DashboardPage: React.FC = () => {
  const { activeRole, isLoading, isSystemAdmin } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
        <span className="ml-2 text-navy-700">Cargando...</span>
      </div>
    );
  }
  
  // System admins see the admin dashboard
  if (isSystemAdmin) {
    return <AdminDashboard />;
  }
  
  // Render different dashboard based on active company role
  switch (activeRole) {
    case 'multiplier':
      return <MultiplierDashboard />;
    case 'geneticsCompany':
      return <GeneticsCompanyDashboard />;
    case 'lab':
      return <LabDashboard />;
    case 'farmer':
      return <FarmerDashboard />;
    default:
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="p-8 text-center border-navy-200/40">
            <h2 className="text-xl font-medium text-red-600 mb-4">Sin empresa activa</h2>
            <p className="text-navy-700">Por favor seleccione una empresa para continuar.</p>
          </Card>
        </div>
      );
  }
};

export default DashboardPage;
