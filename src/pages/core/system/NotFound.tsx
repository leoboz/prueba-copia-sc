
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100/30 flex items-center justify-center">
      <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-xl border border-navy-200/50">
        <CardContent className="text-center py-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-navy-800 mb-2">
            Página no encontrada
          </h2>
          <p className="text-navy-600 mb-4">
            La página que busca no existe o ha sido movida.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-800 hover:to-navy-900">
              Ir al inicio
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} className="border-navy-300 text-navy-700 hover:bg-navy-50">
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
