
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLots } from '@/hooks/useLots';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import GeneticsLotsTable from '@/components/lots/genetics/GeneticsLotsTable';

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'superior', label: 'Superior' },
  { value: 'standard', label: 'Estándar' },
  { value: 'retenido', label: 'Retenido' },
  { value: 'no_analizado', label: 'No analizado' },
];

const GeneticsCompanyLotsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lots, isLoading } = useLots();
  const [filteredLots, setFilteredLots] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (lots && user?.id) {
      // Filter lots where the user is the genetics company (variety creator)
      // This shows ALL lots from their varieties, across all multipliers
      let filtered = lots.filter(lot => lot.variety?.createdBy === user.id);

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(lot =>
          lot.code.toLowerCase().includes(query) ||
          lot.variety?.name?.toLowerCase().includes(query) ||
          lot.variety?.crop?.name?.toLowerCase().includes(query) ||
          lot.plant?.name?.toLowerCase().includes(query) ||
          lot.user?.name?.toLowerCase().includes(query) ||
          lot.user?.email?.toLowerCase().includes(query)
        );
      }

      if (statusFilter !== 'all') {
        // Filter by calculated or final label
        filtered = filtered.filter(lot => {
          // This is a simplified filter - in a real implementation you'd use the label system
          return lot.status === statusFilter;
        });
      }

      // Sort by creation date in descending order
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFilteredLots(filtered);
    }
  }, [lots, user, searchQuery, statusFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-serif text-countryside-soil mb-2">
            Supervisión de Lotes
          </h1>
          <p className="text-countryside-brown-dark">
            Supervise todos los lotes creados con sus variedades registradas
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button
            className="bg-countryside-green hover:bg-countryside-green-dark"
            onClick={() => navigate('/lots/create')}
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo Lote
          </Button>
        </div>
      </header>

      {/* Enhanced Filters */}
      <Card className="mb-8 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-countryside-brown" />
            <Input
              placeholder="Buscar por código, variedad, cultivo, planta o multiplicador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-countryside-brown" />
            <span className="text-sm text-countryside-brown">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm bg-white text-countryside-soil border-countryside-brown/30 focus:border-countryside-green focus:outline-none"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-countryside-brown">
            Mostrando {filteredLots.length} lotes
          </div>
          {(searchQuery || statusFilter !== 'all') && (
            <Button 
              variant="link" 
              onClick={handleClearFilters} 
              className="text-countryside-green"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </Card>

      <GeneticsLotsTable 
        lots={filteredLots}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GeneticsCompanyLotsPage;
