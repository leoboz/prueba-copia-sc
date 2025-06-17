
import { TreeLot } from './types';

export const findRoot = (lot: any, lotsMap: Map<string, any>): TreeLot => {
  let current = lot;
  while (current.originLotId && lotsMap.has(current.originLotId)) {
    current = lotsMap.get(current.originLotId);
  }
  return current;
};

export const calculatePositions = (root: TreeLot, level = 0, siblingIndex = 0): TreeLot => {
  const nodeWidth = 200;
  const nodeHeight = 100;
  const levelHeight = 150;
  
  root.level = level;
  root.y = level * levelHeight + 50;
  
  if (root.children.length === 0) {
    root.x = siblingIndex * nodeWidth + nodeWidth / 2;
  } else {
    // Calculate positions for children first
    root.children = root.children.map((child, index) => 
      calculatePositions(child, level + 1, index)
    );
    
    // Center parent above children
    if (root.children.length === 1) {
      root.x = root.children[0].x;
    } else {
      const leftmost = Math.min(...root.children.map(c => c.x));
      const rightmost = Math.max(...root.children.map(c => c.x));
      root.x = (leftmost + rightmost) / 2;
    }
  }
  
  return root;
};

export const calculateSVGDimensions = (treeData: TreeLot) => {
  const allNodes = [treeData];
  const traverse = (node: TreeLot) => {
    allNodes.push(...node.children);
    node.children.forEach(traverse);
  };
  traverse(treeData);

  const minX = Math.min(...allNodes.map(n => n.x)) - 100;
  const maxX = Math.max(...allNodes.map(n => n.x)) + 100;
  const minY = Math.min(...allNodes.map(n => n.y)) - 60;
  const maxY = Math.max(...allNodes.map(n => n.y)) + 60;
  
  const svgWidth = Math.max(600, maxX - minX);
  const svgHeight = Math.max(300, maxY - minY);

  return { minX, maxX, minY, maxY, svgWidth, svgHeight };
};
