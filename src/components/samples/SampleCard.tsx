
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Tag, User, Beaker, CheckCircle, Calendar, TestTube, Eye } from 'lucide-react';
import { Sample, SampleStatus } from '@/types';

interface SampleCardProps {
  sample: Sample;
  userRole?: 'multiplier' | 'lab';
  onStatusUpdate?: (sampleId: string, status: SampleStatus) => Promise<void>;
  onViewDetails: () => void;
}

const SampleCard: React.FC<SampleCardProps> = ({ sample, userRole = 'multiplier', onStatusUpdate, onViewDetails }) => {
  const getStatusBadge = (status: SampleStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-0">
            <TestTube className="mr-1 h-3 w-3" />
            Enviado
          </Badge>
        );
      case 'received':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg border-0">
            <Eye className="mr-1 h-3 w-3" />
            Recibido
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg border-0">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmado
          </Badge>
        );
      case 'testing':
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-0 animate-pulse">
            <Beaker className="mr-1 h-3 w-3" />
            En Análisis
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg border-0">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-600">
            Desconocido
          </Badge>
        );
    }
  };

  const getStatusGradient = (status: SampleStatus) => {
    switch (status) {
      case 'submitted':
        return 'from-blue-50 to-blue-100/50';
      case 'received':
        return 'from-purple-50 to-purple-100/50';
      case 'confirmed':
        return 'from-indigo-50 to-indigo-100/50';
      case 'testing':
        return 'from-amber-50 to-orange-100/50';
      case 'completed':
        return 'from-emerald-50 to-green-100/50';
      default:
        return 'from-gray-50 to-gray-100/50';
    }
  };

  // Get display title based on user role
  const getDisplayTitle = () => {
    if (userRole === 'lab') {
      return sample.internal_code || 'Sin código';
    }
    return `Muestra ${sample.internal_code || 'Sin código'}`;
  };

  // Get subtitle based on user role
  const getDisplaySubtitle = () => {
    if (userRole === 'lab') {
      return sample.lot?.code ? `Lote: ${sample.lot.code}` : 'Lote: N/A';
    }
    return sample.lot?.code ? `Lote: ${sample.lot.code}` : 'Lote: N/A';
  };

  return (
    <Card className="group relative overflow-hidden bg-white border border-navy-200/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer">
      {/* Status indicator bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${
        sample.status === 'completed' ? 'from-emerald-500 to-green-600' :
        sample.status === 'testing' ? 'from-amber-500 to-orange-500' :
        sample.status === 'confirmed' ? 'from-indigo-500 to-indigo-600' :
        sample.status === 'received' ? 'from-purple-500 to-purple-600' :
        'from-blue-500 to-blue-600'
      }`}></div>
      
      {/* Header Section */}
      <CardContent className={`p-0`}>
        <div className={`p-5 bg-gradient-to-br ${getStatusGradient(sample.status)} border-b border-navy-100/50`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/80 rounded-xl shadow-sm">
                <Tag className="h-4 w-4 text-navy-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-800 text-lg">
                  {getDisplayTitle()}
                </h3>
                <p className="text-navy-600 text-sm">
                  {getDisplaySubtitle()}
                </p>
              </div>
            </div>
            {getStatusBadge(sample.status)}
          </div>
          
          <div className="space-y-2 text-sm text-navy-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-navy-400 rounded-full"></div>
              <span className="font-medium">Cultivo:</span> 
              <span>{sample.lot?.variety?.crop?.name || 'N/A'}</span>
            </div>
            
            {/* Show variety only for multiplier, hide for lab */}
            {userRole === 'multiplier' && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-navy-400 rounded-full"></div>
                <span className="font-medium">Variedad:</span> 
                <span>{sample.lot?.variety?.name || 'N/A'}</span>
              </div>
            )}
            
            {/* Show multiplier name for lab users */}
            {userRole === 'lab' && sample.lot?.user && (
              <div className="flex items-center gap-2 pt-1">
                <User className="h-3.5 w-3.5 text-navy-500" />
                <span className="font-medium">Multiplicador:</span> 
                <span className="text-navy-600">{sample.lot.user.name}</span>
              </div>
            )}

            {/* Show customer info for multiplier users */}
            {userRole === 'multiplier' && sample.lot?.user && (
              <div className="flex items-center gap-2 pt-1">
                <User className="h-3.5 w-3.5 text-navy-500" />
                <span className="font-medium">Cliente:</span> 
                <span className="text-navy-600">{sample.lot.user.name}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Section */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-navy-500">
              <Calendar className="h-3 w-3" />
              <span>Creado: {new Date(sample.createdAt).toLocaleDateString()}</span>
            </div>
            {sample.estimatedResultDate && (
              <div className="text-xs text-navy-500">
                Est. resultados: {new Date(sample.estimatedResultDate).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {sample.status === 'received' && onStatusUpdate && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate(sample.id, 'testing');
                }}
                className="flex-1 text-xs border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200"
              >
                <Beaker className="h-3 w-3 mr-1" /> Iniciar Análisis
              </Button>
            )}
            
            {sample.status === 'testing' && onStatusUpdate && (
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate(sample.id, 'completed');
                }}
                className="flex-1 text-xs bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-200"
              >
                <CheckCircle className="h-3 w-3 mr-1" /> Completar
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex-1 text-xs border-navy-200 text-navy-700 hover:bg-navy-50 hover:border-navy-300 transition-all duration-200 group-hover:bg-navy-100"
            >
              <FileText className="h-3 w-3 mr-1" /> Ver Detalles
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-500/5 to-navy-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Card>
  );
};

export default SampleCard;
