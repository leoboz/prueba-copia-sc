
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LotFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  statusOptions: { value: string; label: string }[];
}

const LotFilterBar: React.FC<LotFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  statusOptions
}) => {
  return (
    <div className="bg-gradient-to-r from-white via-navy-50/60 to-white p-8 rounded-3xl border border-navy-200/40 shadow-2xl backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Search Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-navy-500/60 group-focus-within:text-navy-800 transition-colors duration-200" />
            <Input
              placeholder="Buscar por código, variedad o cultivo..."
              className="pl-16 pr-6 py-5 bg-white/95 backdrop-blur-sm border-navy-200/60 rounded-2xl text-navy-900 placeholder:text-navy-500/70 focus:border-navy-700 focus:ring-4 focus:ring-navy-500/20 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-navy-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-navy-800">
              <div className="p-3 bg-gradient-to-br from-navy-100/80 to-navy-50/60 rounded-2xl shadow-md">
                <Filter className="h-6 w-6 text-navy-700" />
              </div>
              <span className="text-lg font-bold">Estado:</span>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="bg-white/95 backdrop-blur-sm border-navy-200/60 rounded-2xl text-navy-900 focus:border-navy-700 focus:ring-4 focus:ring-navy-500/20 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold px-6 py-5">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-white/98 backdrop-blur-lg border-navy-200/60 rounded-2xl shadow-2xl">
                {statusOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-navy-900 hover:bg-navy-100/80 focus:bg-navy-200/70 rounded-xl font-semibold py-4 px-6 margin-2"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotFilterBar;
