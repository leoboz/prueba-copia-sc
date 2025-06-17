
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import GeneticsCompanyPermissionsPage from './GeneticsCompanyPermissionsPage';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const PermissionsPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark"></div>
        <span className="ml-2 text-countryside-brown">Cargando...</span>
      </div>
    );
  }
  
  // Currently only genetics companies and admins can manage permissions
  switch (user?.role) {
    case 'geneticsCompany':
      return <GeneticsCompanyPermissionsPage />;
    case 'admin':
      return <GeneticsCompanyPermissionsPage />;
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

export default PermissionsPage;
