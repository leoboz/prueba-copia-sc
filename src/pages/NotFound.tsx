
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-countryside-cream">
      <div className="max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <Sprout className="h-12 w-12 text-countryside-green-dark animate-sway" />
        </div>
        
        <h1 className="text-6xl font-serif text-countryside-soil font-bold mb-4">404</h1>
        <h2 className="text-2xl font-serif text-countryside-brown-dark mb-6">Página no encontrada</h2>
        
        <p className="mb-8 text-countryside-brown-dark">
          La página que está buscando no existe o ha sido movida a otra ubicación.
        </p>
        
        <Button asChild className="bg-countryside-green hover:bg-countryside-green-dark">
          <Link to="/">Volver a la página principal</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
