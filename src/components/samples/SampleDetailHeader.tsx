
import React from 'react';
import { Sample } from '@/types';
import { CardHeader, CardTitle } from '@/components/ui/card';
import SampleStatusBadge from './SampleStatusBadge';

interface SampleDetailHeaderProps {
  status: Sample['status'];
}

const SampleDetailHeader: React.FC<SampleDetailHeaderProps> = ({ status }) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <CardTitle className="text-4xl font-serif text-navy-900 font-bold">
          Detalles de la Muestra
        </CardTitle>
        <SampleStatusBadge status={status} />
      </div>
    </CardHeader>
  );
};

export default SampleDetailHeader;
