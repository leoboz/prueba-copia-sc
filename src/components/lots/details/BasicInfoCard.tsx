
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Wheat, Leaf, Calendar, Clock } from 'lucide-react';
import { LotWithDetails } from '@/types/lot-lookup';

interface BasicInfoCardProps {
  lot: LotWithDetails;
  formatDate: (dateString: string | undefined) => string;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ lot, formatDate }) => {
  return (
    <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <CardTitle className="flex items-center text-xl font-serif">
          <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
          <Tag className="h-6 w-6 mr-3" />
          Información del Lote
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-navy-50 to-white rounded-xl border border-navy-100/50">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                <Wheat className="h-6 w-6 text-white drop-shadow-sm" />
              </div>
              <div>
                <p className="text-sm text-navy-600 font-medium">Cultivo</p>
                <p className="font-bold text-navy-900 text-lg">
                  {lot.variety?.crop?.name || 'No especificado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-navy-50 to-white rounded-xl border border-navy-100/50">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <Leaf className="h-6 w-6 text-white drop-shadow-sm" />
              </div>
              <div>
                <p className="text-sm text-navy-600 font-medium">Variedad</p>
                <p className="font-bold text-navy-900 text-lg">
                  {lot.variety?.name || 'No especificada'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-navy-50 to-white rounded-xl border border-navy-100/50">
              <div className="p-3 bg-gradient-to-br from-navy-500 to-navy-600 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white drop-shadow-sm" />
              </div>
              <div>
                <p className="text-sm text-navy-600 font-medium">Fecha de Creación</p>
                <p className="font-bold text-navy-900 text-lg">
                  {formatDate(lot.createdAt)}
                </p>
              </div>
            </div>
            
            {lot.updatedAt && lot.updatedAt !== lot.createdAt && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-navy-50 to-white rounded-xl border border-navy-100/50">
                <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg">
                  <Clock className="h-6 w-6 text-white drop-shadow-sm" />
                </div>
                <div>
                  <p className="text-sm text-navy-600 font-medium">Última Actualización</p>
                  <p className="font-bold text-navy-900 text-lg">
                    {formatDate(lot.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
