
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SamplesSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const SamplesSearchFilter: React.FC<SamplesSearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <Card className="mb-8 bg-white/90 backdrop-blur-sm border-navy-200/40 shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
            <Input
              placeholder="Buscar por código de lote, variedad o cultivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-navy-200 focus:border-navy-400 focus:ring-navy-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'bg-navy-700 hover:bg-navy-800' : 'border-navy-300 text-navy-700 hover:bg-navy-50'}
            >
              Todas
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('completed')}
              className={statusFilter === 'completed' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-navy-300 text-navy-700 hover:bg-navy-50'}
            >
              Completadas
            </Button>
            <Button
              variant={statusFilter === 'testing' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('testing')}
              className={statusFilter === 'testing' ? 'bg-amber-600 hover:bg-amber-700' : 'border-navy-300 text-navy-700 hover:bg-navy-50'}
            >
              En Análisis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SamplesSearchFilter;
