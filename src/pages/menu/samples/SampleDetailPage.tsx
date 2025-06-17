import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';

const SampleDetailPage: React.FC = () => {
  const { sampleId } = useParams<{ sampleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('SampleDetailPage useEffect: user=', user, 'sampleId=', sampleId);
    if (!user || !sampleId) {
      console.log('No user or sampleId, skipping navigation');
      return;
    }

    // Redirect to role-specific page
    if (user.role === 'lab' || user.role === 'admin') {
      console.log(`Navigating to /lab/samples/${sampleId}`);
      navigate(`/lab/samples/${sampleId}`, { replace: true });
    } else if (user.role === 'multiplier') {
      console.log(`Navigating to /multiplier/samples/${sampleId}`);
      navigate(`/multiplier/samples/${sampleId}`, { replace: true });
    } else {
      console.log('Navigating to /samples');
      navigate('/samples', { replace: true });
    }
  }, [user, sampleId, navigate]);

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <p className="text-countryside-brown">Cargando autenticación...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-8 text-center">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark"></div>
          <span className="ml-2 text-countryside-brown">Redirigiendo...</span>
        </div>
      </Card>
    </div>
  );
};

export default SampleDetailPage;