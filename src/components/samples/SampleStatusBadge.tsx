
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sample } from '@/types';

interface SampleStatusBadgeProps {
  status: Sample['status'];
}

const SampleStatusBadge: React.FC<SampleStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'submitted':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Enviado</Badge>;
    case 'received':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Recibido</Badge>;
    case 'confirmed':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Confirmado</Badge>;
    case 'testing':
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">En Análisis</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completado</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export default SampleStatusBadge;
