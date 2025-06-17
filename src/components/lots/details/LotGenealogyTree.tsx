
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LotGenealogyTreeProps, TreeLot } from './genealogy/types';
import { findRoot, calculatePositions, calculateSVGDimensions } from './genealogy/treeUtils';
import TreeConnections from './genealogy/TreeConnections';
import TreeNodes from './genealogy/TreeNodes';
import TreeLegend from './genealogy/TreeLegend';

const LotGenealogyTree: React.FC<LotGenealogyTreeProps> = ({ currentLot }) => {
  const [treeData, setTreeData] = useState<TreeLot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenealogyData();
  }, [currentLot.id]);

  const fetchGenealogyData = async () => {
    try {
      setLoading(true);
      
      // Fetch all lots to build the complete family tree
      const { data: allLots, error } = await supabase
        .from('lots')
        .select(`
          id,
          code,
          origin_lot_id,
          calculated_label_id,
          final_label_id,
          variety:varieties(
            name,
            crop:crops(name)
          )
        `);

      if (error) throw error;

      const lotsMap = new Map<string, any>();
      allLots?.forEach(lot => {
        lotsMap.set(lot.id, {
          id: lot.id,
          code: lot.code,
          varietyName: lot.variety?.name,
          cropName: lot.variety?.crop?.name,
          calculated_label_id: lot.calculated_label_id,
          final_label_id: lot.final_label_id,
          originLotId: lot.origin_lot_id,
          children: []
        });
      });

      // Build parent-child relationships
      lotsMap.forEach(lot => {
        if (lot.originLotId && lotsMap.has(lot.originLotId)) {
          lotsMap.get(lot.originLotId).children.push(lot);
        }
      });

      // Find the root of current lot's family tree
      const currentLotData = lotsMap.get(currentLot.id);
      if (currentLotData) {
        const root = findRoot(currentLotData, lotsMap);
        const treeWithPositions = calculatePositions(root);
        setTreeData(treeWithPositions);
      }
    } catch (error) {
      console.error('Error fetching genealogy data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-navy-200/50 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy-600"></div>
            <span className="text-navy-600">Cargando árbol genealógico...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!treeData) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-navy-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-navy-800 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-navy-600" />
            Genealogía del Lote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-navy-100 flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-navy-400" />
            </div>
            <p className="text-navy-600 font-medium">Lote Original</p>
            <p className="text-sm text-navy-500 mt-1">
              Este lote no tiene relaciones familiares
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { minX, minY, maxX, maxY, svgWidth, svgHeight } = calculateSVGDimensions(treeData);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-navy-200/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-navy-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-navy-600" />
          Árbol Genealógico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg 
            width={svgWidth} 
            height={svgHeight}
            className="border border-navy-100 rounded-lg bg-gradient-to-br from-navy-25 to-blue-25"
            viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#64748b"
                />
              </marker>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            
            <TreeConnections treeData={treeData} />
            <TreeNodes treeData={treeData} currentLotId={currentLot.id} />
          </svg>
        </div>
        
        <TreeLegend />
      </CardContent>
    </Card>
  );
};

export default LotGenealogyTree;
