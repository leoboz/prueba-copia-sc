
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface UsersTableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

const UsersTableSearch: React.FC<UsersTableSearchProps> = ({
  searchTerm,
  onSearchChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 h-4 w-4" />
        <Input
          placeholder="Buscar usuarios por nombre, email o empresa..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-navy-200 focus:border-navy-600 focus:ring-navy-600"
        />
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="border-navy-200 text-navy-700 bg-navy-50">
          {filteredCount} usuarios encontrados
        </Badge>
        <Badge className="bg-navy-600 text-white">
          {totalCount} total
        </Badge>
      </div>
    </div>
  );
};

export default UsersTableSearch;
