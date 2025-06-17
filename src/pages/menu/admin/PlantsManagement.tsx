
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Factory, AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PlantsManagement: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect users to the main plants page based on their role
  if (user.role === 'multiplier' || user.role === 'geneticsCompany') {
    return <Navigate to="/plants" replace />;
  }

  // For admin users, show access to the main plants page
  if (user.role === 'admin') {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-countryside-brown">
              Gestión de Plantas
            </h1>
            <p className="text-countryside-brown/70 mt-2">
              Administre las plantas del sistema
            </p>
          </div>
        </div>

        <Card className="border-navy-200/40 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-navy-900 flex items-center">
              <Factory className="h-6 w-6 mr-3 text-navy-700" />
              Acceso a Gestión de Plantas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mx-auto bg-navy-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Factory className="h-8 w-8 text-navy-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-4">
                Panel de Gestión de Plantas
              </h3>
              <p className="text-navy-600 mb-6 max-w-md mx-auto">
                Acceda al sistema completo de gestión de plantas donde puede supervisar 
                todas las plantas registradas por multiplicadores y su estado de verificación.
              </p>
              <Button 
                onClick={() => window.location.href = '/plants'}
                className="bg-navy-900 hover:bg-navy-800 text-white shadow-lg"
              >
                <Factory className="mr-2 h-4 w-4" />
                Ir a Gestión de Plantas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acceso denegado</AlertTitle>
        <AlertDescription>
          No tiene permisos para acceder a esta página.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PlantsManagement;
