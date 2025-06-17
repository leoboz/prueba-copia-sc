
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Calculator, AlertCircle } from 'lucide-react';
import { useLotLabels } from '@/hooks/useLotLabels';
import { getEffectiveLotLabel, hasPGOOverride, getLotLabelColor } from '@/utils/lotStatusUtils';

interface LabelStatusCardProps {
  lot: any;
  formatDate: (date: string) => string;
}

const LabelStatusCard: React.FC<LabelStatusCardProps> = ({ lot, formatDate }) => {
  const { labels } = useLotLabels();
  
  const effectiveLabel = getEffectiveLotLabel(lot, labels || []);
  const hasOverride = hasPGOOverride(lot);
  
  const calculatedLabel = labels?.find(label => label.id === lot.calculatedLabelId);
  const finalLabel = labels?.find(label => label.id === lot.finalLabelId);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-navy-200/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-navy-800 flex items-center gap-2">
          <Shield className="h-5 w-5 text-navy-600" />
          Estado de Etiquetado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Effective Label */}
        <div className="space-y-2">
          <h4 className="font-medium text-navy-700">Estado Actual</h4>
          <Badge className={`${getLotLabelColor(effectiveLabel?.name || '')} px-3 py-1 text-sm font-medium`}>
            {hasOverride && <Shield className="h-3 w-3 mr-1" />}
            {effectiveLabel?.name || 'No analizado'}
            {hasOverride && ' (PGO)'}
          </Badge>
        </div>

        {/* Calculated Label */}
        {calculatedLabel && (
          <div className="space-y-2">
            <h4 className="font-medium text-navy-700 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Etiqueta Calculada
            </h4>
            <Badge className={`${getLotLabelColor(calculatedLabel.name)} px-3 py-1 text-sm`}>
              {calculatedLabel.name}
            </Badge>
          </div>
        )}

        {/* PGO Override Information */}
        {hasOverride && finalLabel && (
          <div className="space-y-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Override PGO Aplicado
            </h4>
            <div className="space-y-1 text-sm text-purple-700">
              <p><strong>Etiqueta Final:</strong> {finalLabel.name}</p>
              <p><strong>Razón:</strong> {lot.pgoOverrideReason}</p>
              {lot.pgoOverriddenAt && (
                <p><strong>Fecha:</strong> {formatDate(lot.pgoOverriddenAt)}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LabelStatusCard;
