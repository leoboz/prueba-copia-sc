
export interface TreeLot {
  id: string;
  code: string;
  varietyName?: string;
  cropName?: string;
  calculated_label_id?: string;
  final_label_id?: string;
  originLotId?: string;
  children: TreeLot[];
  level: number;
  x: number;
  y: number;
}

export interface LotGenealogyTreeProps {
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
