
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MultiplierLotsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MultiplierLotsSearch: React.FC<MultiplierLotsSearchProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-navy-200/40 shadow-lg">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-600/70" />
        <Input
          type="text"
          placeholder="Buscar lotes por código, variedad o cultivo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-4 py-3 w-full border-navy-200/40 focus:border-navy-400 focus:ring-navy-400/20 rounded-xl bg-white/90 backdrop-blur-sm text-navy-800 placeholder:text-navy-600/60 font-medium"
        />
      </div>
    </div>
  );
};

export default MultiplierLotsSearch;
