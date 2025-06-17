
import React from 'react';
import LotGenealogyTree from './LotGenealogyTree';

interface LotOriginCardProps {
  currentLot: {
    id: string;
    code: string;
    variety?: {
      name: string;
      crop?: { name: string };
    };
    calculated_label_id?: string;
    final_label_id?: string;
  };
}

const LotOriginCard: React.FC<LotOriginCardProps> = ({ currentLot }) => {
  return <LotGenealogyTree currentLot={currentLot} />;
};

export default LotOriginCard;
