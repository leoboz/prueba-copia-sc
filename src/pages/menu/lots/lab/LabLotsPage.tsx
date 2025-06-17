import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLots } from '@/hooks/useLots';
import { useSamples } from '@/hooks/useSamples';
import { Sample } from '@/types';
import { Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const LabLotsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lots, isLoading } = useLots();
  const { samples } = useSamples();
  const [displayLots, setDisplayLots] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (lots && user) {
      // Filter lots where the user is the assigned lab
      let filteredLots = lots.filter(lot => lot.userId === user.id);

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredLots = filteredLots.filter(lot =>
          lot.code.toLowerCase().includes(query) ||
          lot.variety?.name?.toLowerCase().includes(query) ||
          lot.variety?.crop?.name?.toLowerCase().includes(query)
        );
      }

      setDisplayLots(filteredLots);
    }
  }, [lots, user, searchQuery]);

  const handleViewDetails = (lotId: string) => {
    navigate(`/lots/${lotId}`);
  };

  const getLatestSampleStatus = (lotId: string) => {
    if (!samples) return 'Sin muestras';
    const lotSamples = samples.filter(sample => sample.lotId === lotId);
    if (lotSamples.length === 0) return 'Sin muestras';

    const latestSample = lotSamples.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return latestSample.status;
  };

  const getStatusIcon = (lot: any) => {
      switch (lot.status) {
        case 'superior':
          return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'standard':
          return <Clock className="h-4 w-4 text-blue-600" />;
        case 'retenido':
          return <AlertTriangle className="h-4 w-4 text-red-600" />;
        default:
          return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'superior':
          return 'text-green-600 bg-green-50';
        case 'standard':
          return 'text-blue-600 bg-blue-50';
        case 'retenido':
          return 'text-red-600 bg-red-50';
        default:
          return 'text-gray-600 bg-gray-50';
      }
    };

    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'superior':
          return 'Superior';
        case 'standard':
          return 'Estándar';
        case 'retenido':
          return 'Retenido';
        default:
          return 'Desconocido';
      }
    };

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <p className="text-countryside-brown">Cargando autenticación...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-countryside-soil">
          Lotes Asignados
        </h1>
        <p className="text-countryside-brown-dark mt-1">
          Supervise los lotes asignados a su laboratorio
        </p>
      </header>

      <Card className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar lotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md text-countryside-soil border-countryside-brown/30 focus:border-countryside-green focus:outline-none"
          />
          <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-countryside-brown" />
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-6 text-center">
          <p className="text-countryside-brown">Cargando lotes...</p>
        </Card>
      ) : displayLots.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cultivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Muestra</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayLots.map(lot => (
                <TableRow key={lot.id}>
                  <TableCell>{lot.code}</TableCell>
                  <TableCell>{lot.variety?.crop?.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium ${getStatusColor(lot.status)}`}>
                      {getStatusIcon(lot)}
                      {getStatusLabel(lot.status)}
                    </span>
                  </TableCell>
                  <TableCell>{getLatestSampleStatus(lot.id)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(lot.id)}
                      className="text-xs"
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-countryside-brown">No hay lotes asignados.</p>
        </Card>
      )}
    </div>
  );
};

export default LabLotsPage;
