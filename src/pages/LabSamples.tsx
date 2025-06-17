import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSamples } from '@/hooks/useSamples';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Beaker,
  Filter,
  Search,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SampleStatus } from '@/types';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const LabSamples: React.FC = () => {
  const { samples, isLoading, updateSampleStatus } = useSamples();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SampleStatus | 'all'>('all');
  const [displaySamples, setDisplaySamples] = useState<any[]>([]);
  
  useEffect(() => {
    if (samples) {
      // Filter samples based on search term and status filter
      let filteredSamples = samples;
      
      // Filter by lab if current user is from a lab
      if (user && user.role === 'lab') {
        filteredSamples = filteredSamples.filter(sample => sample.userId === user.id); // Changed from labId to userId
      }
      
      // Filter by status if a specific status is selected
      if (statusFilter !== 'all') {
        filteredSamples = filteredSamples.filter(sample => sample.status === statusFilter);
      }
      
      // Filter by search term
      if (searchTerm) {
        filteredSamples = filteredSamples.filter(sample => {
          // Search by lot code if available
          const lotCode = sample.lot?.code || '';
          return lotCode.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
      
      setDisplaySamples(filteredSamples);
    }
  }, [samples, searchTerm, statusFilter, user]);
  
  const handleStatusUpdate = async (sampleId: string, newStatus: SampleStatus) => {
    try {
      await updateSampleStatus.mutateAsync({ sampleId, status: newStatus });
    } catch (error) {
      console.error("Error updating sample status:", error);
    }
  };
  
  const getStatusBadge = (status: SampleStatus) => {
    switch(status) {
      case 'received':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Recibida</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmada</Badge>;
      case 'testing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En Análisis</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-countryside-soil">
          Muestras para Análisis
        </h1>
        <p className="text-countryside-brown-dark mt-1">
          Gestión de muestras y resultados de laboratorio
        </p>
      </header>
      
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-countryside-brown" />
            <Input
              placeholder="Buscar por código de lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-countryside-brown" />
            <span className="text-sm text-countryside-brown">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SampleStatus | 'all')}
              className="border rounded px-3 py-2 text-sm bg-white text-countryside-soil border-countryside-brown/30 focus:border-countryside-green focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="received">Recibidas</option>
              <option value="confirmed">Confirmadas</option>
              <option value="testing">En Análisis</option>
              <option value="completed">Completadas</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark"></div>
            <span className="ml-2 text-countryside-brown">Cargando muestras...</span>
          </div>
        ) : displaySamples.length > 0 ? (
          <Tabs defaultValue="list">
            <TabsList className="mb-6">
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código de Lote</TableHead>
                      <TableHead>Cultivo/Variedad</TableHead>
                      <TableHead>Fecha Recibida</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displaySamples.map((sample) => (
                      <TableRow key={sample.id}>
                        <TableCell>
                          {sample.lot?.code || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {sample.lot?.variety?.crop?.name || 'N/A'} / {sample.lot?.variety?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {new Date(sample.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sample.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {sample.status === 'received' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleStatusUpdate(sample.id, 'confirmed')}
                                className="text-xs border-countryside-brown/30 hover:bg-countryside-amber hover:text-countryside-soil"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" /> Confirmar
                              </Button>
                            )}
                            {sample.status === 'confirmed' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleStatusUpdate(sample.id, 'testing')}
                                className="text-xs border-countryside-brown/30 hover:bg-countryside-amber hover:text-countryside-soil"
                              >
                                <Beaker className="h-3 w-3 mr-1" /> Iniciar análisis
                              </Button>
                            )}
                            {sample.status === 'testing' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusUpdate(sample.id, 'completed')}
                                className="text-xs bg-countryside-green hover:bg-countryside-green-dark text-white"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" /> Completar
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-xs text-countryside-brown hover:text-countryside-soil"
                            >
                              <FileText className="h-3 w-3 mr-1" /> Detalles
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displaySamples.map((sample) => (
                  <Card key={sample.id} className="overflow-hidden">
                    <CardContent className="p-4 bg-countryside-cream/20 border-b border-countryside-brown/10">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-countryside-soil">
                            Lote #{sample.lot?.code || 'N/A'}
                          </h3>
                          <p className="text-xs text-countryside-brown mt-1">
                            {sample.lot?.variety?.crop?.name || 'N/A'} / {sample.lot?.variety?.name || 'N/A'}
                          </p>
                        </div>
                        {getStatusBadge(sample.status)}
                      </div>
                    </CardContent>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <Clock className="h-4 w-4 text-countryside-brown-dark mr-2" />
                        <span className="text-sm text-countryside-brown-dark">
                          Recibida: {new Date(sample.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-end mt-4 gap-2">
                        {sample.status === 'received' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleStatusUpdate(sample.id, 'confirmed')}
                            className="text-xs border-countryside-brown/30 hover:bg-countryside-amber hover:text-countryside-soil"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" /> Confirmar
                          </Button>
                        )}
                        {sample.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleStatusUpdate(sample.id, 'testing')}
                            className="text-xs border-countryside-brown/30 hover:bg-countryside-amber hover:text-countryside-soil"
                          >
                            <Beaker className="h-3 w-3 mr-1" /> Iniciar análisis
                          </Button>
                        )}
                        {sample.status === 'testing' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(sample.id, 'completed')}
                            className="text-xs bg-countryside-green hover:bg-countryside-green-dark text-white"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" /> Completar
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs text-countryside-brown hover:text-countryside-soil"
                        >
                          <FileText className="h-3 w-3 mr-1" /> Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-48">
            <AlertTriangle className="h-8 w-8 text-countryside-amber mb-4" />
            <p className="text-countryside-brown">No se encontraron muestras</p>
            {searchTerm || statusFilter !== 'all' ? (
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="mt-2 text-countryside-green"
              >
                Limpiar filtros
              </Button>
            ) : null}
          </div>
        )}
      </Card>
      
      {user && user.role === 'lab' && (
        <Card className="p-6">
          <CardContent>
            <h2 className="text-xl font-serif text-countryside-soil mb-4">Resumen de Actividad</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-countryside-cream/20 p-4 rounded border border-countryside-brown/10">
                <CardContent>
                  <p className="text-sm text-countryside-brown">Muestras Pendientes</p>
                  <p className="text-2xl font-bold text-countryside-soil">
                    {displaySamples.filter(s => s.status !== 'completed').length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-countryside-cream/20 p-4 rounded border border-countryside-brown/10">
                <CardContent>
                  <p className="text-sm text-countryside-brown">Muestras Completadas</p>
                  <p className="text-2xl font-bold text-countryside-green-dark">
                    {displaySamples.filter(s => s.status === 'completed').length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-countryside-cream/20 p-4 rounded border border-countryside-brown/10">
                <CardContent>
                  <p className="text-sm text-countryside-brown">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-countryside-soil">3.4 días</p>
                </CardContent>
              </Card>
              
              <Card className="bg-countryside-cream/20 p-4 rounded border border-countryside-brown/10">
                <CardContent>
                  <p className="text-sm text-countryside-brown">Tasa de Aprobación</p>
                  <p className="text-2xl font-bold text-countryside-amber-dark">92%</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LabSamples;