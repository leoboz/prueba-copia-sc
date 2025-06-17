import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useFetchSamples } from '@/hooks/useFetchSamples';
import { useSampleDetails } from '@/hooks/useSampleDetails';
import { 
  FlaskConical, 
  Search, 
  Filter, 
  TestTube, 
  Clock, 
  CheckCircle, 
  Beaker,
  FileText,
  AlertTriangle
} from 'lucide-react';
import SampleCard from '@/components/samples/SampleCard';
import { toast } from '@/hooks/use-toast';
import { SampleStatus } from '@/types';

const LabSamplesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { samples, isLoading } = useFetchSamples();
  const { updateSampleStatus } = useSampleDetails();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSamples = useMemo(() => {
    if (!samples || !user) return [];
    
    let filtered = samples.filter(sample => sample.userId === user.id);
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sample => sample.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(sample => {
        const lotCode = sample.lot?.code || '';
        const cropName = sample.lot?.variety?.crop?.name || '';
        const internalCode = sample.internal_code || '';
        return (
          lotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internalCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [samples, user, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    if (!filteredSamples.length) return { total: 0, pending: 0, testing: 0, completed: 0 };
    
    return {
      total: filteredSamples.length,
      pending: filteredSamples.filter(s => s.status === 'received' || s.status === 'confirmed').length,
      testing: filteredSamples.filter(s => s.status === 'testing').length,
      completed: filteredSamples.filter(s => s.status === 'completed').length,
    };
  }, [filteredSamples]);

  const handleViewDetails = (sampleId: string) => {
    navigate(`/lab/samples/${sampleId}`);
  };

  const handleStatusUpdate = async (sampleId: string, status: SampleStatus) => {
    try {
      await updateSampleStatus.mutateAsync({ sampleId, status });
      toast({
        title: "Estado actualizado",
        description: `La muestra ha sido actualizada exitosamente.`,
      });
    } catch (error) {
      console.error('Error updating sample status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la muestra.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-medium text-red-600 mb-4">Acceso denegado</h2>
            <p className="text-navy-700">Debe iniciar sesión para acceder a esta página.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <FlaskConical className="mr-4 h-10 w-10" />
              Muestras de Laboratorio
            </h1>
            <p className="text-blue-100 text-lg">
              Gestione las muestras asignadas a su laboratorio
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-navy-600 to-navy-700 p-1">
              <CardContent className="bg-white m-1 rounded p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-navy-800">{stats.total}</p>
                  </div>
                  <TestTube className="h-8 w-8 text-navy-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1">
              <CardContent className="bg-white m-1 rounded p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700 mb-1">Pendientes</p>
                    <p className="text-2xl font-bold text-amber-800">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1">
              <CardContent className="bg-white m-1 rounded p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">En Análisis</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.testing}</p>
                  </div>
                  <Beaker className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-1">
              <CardContent className="bg-white m-1 rounded p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700 mb-1">Completadas</p>
                    <p className="text-2xl font-bold text-emerald-800">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
                <Input
                  placeholder="Buscar por código de lote, código interno o cultivo..."
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
                  variant={statusFilter === 'received' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('received')}
                  className={statusFilter === 'received' ? 'bg-orange-600 hover:bg-orange-700' : 'border-navy-300 text-navy-700 hover:bg-navy-50'}
                >
                  Recibidas
                </Button>
                <Button
                  variant={statusFilter === 'testing' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('testing')}
                  className={statusFilter === 'testing' ? 'bg-amber-600 hover:bg-amber-700' : 'border-navy-300 text-navy-700 hover:bg-navy-50'}
                >
                  En Análisis
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                  className={statusFilter === 'completed' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-navy-300 text-navy-700 hover:bg-navy-50'}
                >
                  Completadas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Samples Grid */}
        {isLoading ? (
          <Card className="p-12 text-center bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-navy-100 to-navy-200 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-navy-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-navy-600 text-lg font-medium">Cargando muestras...</p>
          </Card>
        ) : filteredSamples.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSamples.map(sample => (
              <SampleCard 
                key={sample.id} 
                sample={sample} 
                userRole="lab"
                onStatusUpdate={handleStatusUpdate}
                onViewDetails={() => handleViewDetails(sample.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-navy-100 to-navy-200 rounded-full flex items-center justify-center">
              {searchTerm || statusFilter !== 'all' ? (
                <AlertTriangle className="h-10 w-10 text-navy-600" />
              ) : (
                <TestTube className="h-10 w-10 text-navy-600" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-navy-800 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No se encontraron muestras' : 'No hay muestras asignadas'}
            </h3>
            <p className="text-navy-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda para encontrar las muestras que buscas.'
                : 'Las muestras aparecerán aquí una vez que se asignen a su laboratorio.'
              }
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700 text-white"
              >
                Limpiar Filtros
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default LabSamplesPage;
