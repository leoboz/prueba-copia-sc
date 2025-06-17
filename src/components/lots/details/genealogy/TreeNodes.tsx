
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { TreeLot } from './types';
import { useLotLabels } from '@/hooks/useLotLabels';
import { getEffectiveLotLabel } from '@/utils/lotStatusUtils';

interface TreeNodesProps {
  treeData: TreeLot;
  currentLotId: string;
}

const TreeNodes: React.FC<TreeNodesProps> = ({ treeData, currentLotId }) => {
  const navigate = useNavigate();
  const { labels } = useLotLabels();

  const getLabelColorClass = (lot: TreeLot) => {
    const lotWithLabels = {
      id: lot.id,
      calculated_label_id: lot.calculated_label_id,
      final_label_id: lot.final_label_id,
      status: 'active'
    };
    
    const effectiveLabel = getEffectiveLotLabel(lotWithLabels, labels || []);
    const labelName = effectiveLabel?.name || 'No analizado';
    
    switch (labelName.toLowerCase()) {
      case 'superior':
        return 'border-green-400 bg-green-50 text-green-800 shadow-green-200';
      case 'standard':
        return 'border-blue-400 bg-blue-50 text-blue-800 shadow-blue-200';
      case 'retenido':
        return 'border-red-400 bg-red-50 text-red-800 shadow-red-200';
      case 'pgo':
        return 'border-purple-400 bg-purple-50 text-purple-800 shadow-purple-200';
      default:
        return 'border-gray-400 bg-gray-50 text-gray-800 shadow-gray-200';
    }
  };

  const getLabelName = (lot: TreeLot) => {
    const lotWithLabels = {
      id: lot.id,
      calculated_label_id: lot.calculated_label_id,
      final_label_id: lot.final_label_id,
      status: 'active'
    };
    
    const effectiveLabel = getEffectiveLotLabel(lotWithLabels, labels || []);
    return effectiveLabel?.name || 'No analizado';
  };

  const handleNodeClick = (lotCode: string) => {
    navigate(`/lot-details/${encodeURIComponent(lotCode)}`);
  };

  const renderNodes = (lot: TreeLot): JSX.Element[] => {
    const nodes: JSX.Element[] = [];
    const isCurrentLot = lot.id === currentLotId;
    
    nodes.push(
      <g key={lot.id} transform={`translate(${lot.x - 90}, ${lot.y - 40})`}>
        <foreignObject width="180" height="80">
          <Button
            onClick={() => handleNodeClick(lot.code)}
            className={`
              w-full h-full p-3 rounded-xl border-2 transition-all duration-300
              ${getLabelColorClass(lot)}
              ${isCurrentLot ? 'ring-4 ring-navy-400 ring-opacity-50 scale-105' : ''}
              hover:scale-110 hover:shadow-lg transform
            `}
            variant="ghost"
          >
            <div className="text-left w-full space-y-1">
              <div className="font-bold text-sm font-mono truncate">{lot.code}</div>
              <div className="text-xs opacity-75 truncate">
                {lot.varietyName || 'N/A'}
              </div>
              <div className="text-xs font-medium">
                {getLabelName(lot)}
              </div>
            </div>
            {isCurrentLot && (
              <Eye className="absolute top-1 right-1 h-3 w-3 text-navy-600" />
            )}
          </Button>
        </foreignObject>
      </g>
    );
    
    // Recursively add child nodes
    lot.children.forEach(child => {
      nodes.push(...renderNodes(child));
    });
    
    return nodes;
  };

  return <>{renderNodes(treeData)}</>;
};

export default TreeNodes;
