
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tags, Package, Building, Calendar, Scale } from 'lucide-react';

interface LotClassificationCardProps {
  category?: {
    id: string;
    name: string;
  };
  lotType?: {
    id: string;
    name: string;
  };
  plant?: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  campaign?: {
    id: string;
    name: string;
  };
  unit?: {
    id: string;
    name: string;
  };
  amount?: number;
}

const LotClassificationCard: React.FC<LotClassificationCardProps> = ({
  category,
  lotType,
  plant,
  campaign,
  unit,
  amount
}) => {
  const getLotTypeColor = (typeName?: string) => {
    if (!typeName) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (typeName.toLowerCase()) {
      case 'silobolsa': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pre-básica': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'básica': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'registrada': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'fiscalizada': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryColor = (categoryName?: string) => {
    if (!categoryName) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (categoryName.toLowerCase()) {
      case 'premium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'básica': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-navy-50 to-navy-100 border-navy-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-navy-800">
          <div className="w-10 h-10 rounded-xl bg-navy-200 flex items-center justify-center">
            <Tags className="h-5 w-5 text-navy-700" />
          </div>
          Clasificación y Producción
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lot Type */}
          {lotType && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-navy-200/50">
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-4 w-4 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Tipo de Lote</span>
              </div>
              <Badge className={`${getLotTypeColor(lotType.name)} border text-sm px-3 py-1`}>
                {lotType.name}
              </Badge>
            </div>
          )}

          {/* Category */}
          {category && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-navy-200/50">
              <div className="flex items-center gap-3 mb-2">
                <Tags className="h-4 w-4 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Categoría</span>
              </div>
              <Badge className={`${getCategoryColor(category.name)} border text-sm px-3 py-1`}>
                {category.name}
              </Badge>
            </div>
          )}

          {/* Plant */}
          {plant && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-navy-200/50">
              <div className="flex items-center gap-3 mb-2">
                <Building className="h-4 w-4 text-navy-600" />
                <span className="text-sm font-medium text-navy-700">Planta</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-navy-800">{plant.name}</span>
                {plant.isVerified && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                    ✓ Verificada
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Campaign */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-navy-200/50">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-4 w-4 text-navy-600" />
              <span className="text-sm font-medium text-navy-700">Campaña</span>
            </div>
            {campaign ? (
              <span className="font-semibold text-navy-800">{campaign.name}</span>
            ) : (
              <span className="text-slate-500 italic">Sin campaña específica</span>
            )}
          </div>
        </div>

        {/* Amount and Unit */}
        {(amount || unit) && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-navy-200/50">
            <div className="flex items-center gap-3 mb-3">
              <Scale className="h-5 w-5 text-navy-600" />
              <span className="text-sm font-medium text-navy-700">Cantidad</span>
            </div>
            <div className="flex items-baseline gap-2">
              {amount && (
                <span className="text-2xl font-bold text-navy-800">
                  {amount.toLocaleString('es-AR')}
                </span>
              )}
              {unit && (
                <span className="text-lg text-navy-600 font-medium">{unit.name}</span>
              )}
              {!amount && unit && (
                <span className="text-slate-500 italic">Cantidad no especificada</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LotClassificationCard;
