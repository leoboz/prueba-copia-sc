
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
        <h2 className="text-xl font-medium text-red-600 mb-4">Error</h2>
        <p className="text-countryside-brown mb-6">{error}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/samples')}
            className="border-countryside-brown/30 hover:bg-countryside-amber hover:text-countryside-soil"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Muestras
          </Button>
          <Button
            onClick={onRetry}
            className="bg-countryside-green hover:bg-countryside-green-dark mt-2 sm:mt-0"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ErrorState;
