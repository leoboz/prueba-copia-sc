
import React from 'react';

const TreeLegend: React.FC = () => {
  return (
    <div className="border-t border-navy-200/30 pt-4 mt-4">
      <p className="text-xs text-navy-500 mb-2 font-medium">Estados de lotes:</p>
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded border-2 border-green-400 bg-green-50"></div>
          <span className="text-xs text-navy-600">Superior</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded border-2 border-blue-400 bg-blue-50"></div>
          <span className="text-xs text-navy-600">Standard</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded border-2 border-red-400 bg-red-50"></div>
          <span className="text-xs text-navy-600">Retenido</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded border-2 border-purple-400 bg-purple-50"></div>
          <span className="text-xs text-navy-600">PGO</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded border-2 border-gray-400 bg-gray-50"></div>
          <span className="text-xs text-navy-600">No analizado</span>
        </div>
      </div>
    </div>
  );
};

export default TreeLegend;
