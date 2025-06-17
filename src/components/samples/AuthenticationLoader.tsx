
import React from 'react';
import { Card } from '@/components/ui/card';

const AuthenticationLoader: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark mx-auto"></div>
        <h2 className="text-xl font-medium text-countryside-brown mt-4">Autenticando...</h2>
        <p className="text-countryside-brown/70 mt-2">Verificando datos de usuario</p>
      </Card>
    </div>
  );
};

export default AuthenticationLoader;
