
import React from 'react';
import { TreeLot } from './types';

interface TreeConnectionsProps {
  treeData: TreeLot;
}

const TreeConnections: React.FC<TreeConnectionsProps> = ({ treeData }) => {
  const renderConnections = (lot: TreeLot): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    
    lot.children.forEach((child, index) => {
      const pathId = `connection-${lot.id}-${child.id}`;
      const startX = lot.x;
      const startY = lot.y + 40; // Bottom of parent node
      const endX = child.x;
      const endY = child.y - 10; // Top of child node
      
      // Create curved path
      const midY = startY + (endY - startY) / 2;
      const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
      
      connections.push(
        <path
          key={pathId}
          d={path}
          stroke="#64748b"
          strokeWidth="2"
          fill="none"
          className="transition-all duration-300 hover:stroke-navy-600 hover:stroke-3"
          markerEnd="url(#arrowhead)"
        />
      );
      
      // Recursively add connections for children
      connections.push(...renderConnections(child));
    });
    
    return connections;
  };

  return <>{renderConnections(treeData)}</>;
};

export default TreeConnections;
