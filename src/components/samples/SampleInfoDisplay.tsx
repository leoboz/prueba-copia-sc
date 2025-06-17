
import React from 'react';
import { Sample } from '@/types';
import { Tag, Calendar, Clock, User, Building } from 'lucide-react';

interface SampleInfoDisplayProps {
  sample: Sample;
  userRole?: 'multiplier' | 'lab';
}

const SampleInfoDisplay: React.FC<SampleInfoDisplayProps> = ({ sample, userRole }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Tag className="mr-2 h-4 w-4 text-countryside-brown" />
          <span className="text-countryside-brown">Lote: </span>
          <span className="ml-1 font-medium">{sample.lot?.code}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-countryside-brown" />
          <span className="text-countryside-brown">Fecha de Creación: </span>
          <span className="ml-1 font-medium">
            {new Date(sample.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {sample.estimatedResultDate && (
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-countryside-brown" />
            <span className="text-countryside-brown">Fecha Estimada: </span>
            <span className="ml-1 font-medium">
              {new Date(sample.estimatedResultDate).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {userRole === 'lab' && sample.lot?.user && (
          <div className="flex items-center text-sm">
            <Building className="mr-2 h-4 w-4 text-countryside-brown" />
            <span className="text-countryside-brown">Cliente: </span>
            <span className="ml-1 font-medium">{sample.lot.user.name}</span>
          </div>
        )}
        
        {userRole === 'multiplier' && sample.lot?.user && (
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4 text-countryside-brown" />
            <span className="text-countryside-brown">Cliente: </span>
            <span className="ml-1 font-medium">{sample.lot.user.name}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {sample.lot?.variety && (
          <>
            {userRole === 'multiplier' && (
              <>
                <div className="flex items-center text-sm">
                  <span className="text-countryside-brown">Variedad: </span>
                  <span className="ml-1 font-medium">{sample.lot.variety.name}</span>
                </div>
                
                {sample.lot.variety.crop && (
                  <div className="flex items-center text-sm">
                    <span className="text-countryside-brown">Cultivo: </span>
                    <span className="ml-1 font-medium">{sample.lot.variety.crop.name}</span>
                  </div>
                )}
              </>
            )}
            
            {userRole === 'lab' && sample.lot.variety.crop && (
              <div className="flex items-center text-sm">
                <span className="text-countryside-brown">Cultivo: </span>
                <span className="ml-1 font-medium">{sample.lot.variety.crop.name}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SampleInfoDisplay;
