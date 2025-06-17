import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useLots } from '@/hooks/useLots';
import { useSamples } from '@/hooks/useSamples';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  PackageCheck,
  Sprout,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const GeneticsCompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lots, isLoading: isLoadingLots } = useLots();
  const { samples, isLoading: isLoadingSamples } = useSamples();
  const navigate = useNavigate();

  const [recentLots, setRecentLots] = useState([]);

  useEffect(() => {
    if (lots) {
      const sortedLots = [...lots].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentLots(sortedLots.slice(0, 5));
    }
  }, [lots]);

  const stats = useMemo(() => {
    if (!lots || !samples || !user?.id) return null;

    // Filter lots where the user is the genetics company (variety creator)
    const myLots = lots.filter(lot => lot.variety?.createdBy === user.id);
    
    const totalLots = myLots.length;
    const lotsByStatus = {
      superior: myLots.filter(lot => lot.status === 'superior').length,
      standard: myLots.filter(lot => lot.status === 'standard').length,
      retenido: myLots.filter(lot => lot.status === 'retenido').length,
    };

    const totalSamples = samples.length;
    const completedSamples = samples.filter(sample => sample.status === 'completed').length;
    const pendingSamples = totalSamples - completedSamples;

    return {
      totalLots,
      lotsByStatus,
      totalSamples,
      completedSamples,
      pendingSamples,
    };
  }, [lots, samples, user]);

  const statusDistribution = useMemo(() => {
    if (!stats) return [];

    return [
      { name: 'Superior', value: stats.lotsByStatus.superior, color: '#10B981' },
      { name: 'Estándar', value: stats.lotsByStatus.standard, color: '#0369a1' },
      { name: 'Retenido', value: stats.lotsByStatus.retenido, color: '#EF4444' },
    ];
  }, [stats]);

  const pieChartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Completadas', value: stats.completedSamples, color: '#10B981' },
      { name: 'Pendientes', value: stats.pendingSamples, color: '#F59E0B' },
    ];
  }, [stats]);

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="navy-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p className="text-navy-700">Cargando autenticación...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8" />
              Panel de Control Genético
            </h1>
            <p className="text-navy-100 text-lg">
              Monitoreo avanzado de variedades y análisis de calidad
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-navy-600 to-navy-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-navy-100 text-sm font-medium">Lotes Totales</p>
                  <p className="text-3xl font-bold">
                    {isLoadingLots ? (
                      <Skeleton className="h-8 w-16 bg-navy-400" />
                    ) : (
                      stats?.totalLots || 0
                    )}
                  </p>
                </div>
                <div className="bg-navy-500 p-3 rounded-full">
                  <Sprout className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-navy-500 to-navy-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-navy-100 text-sm font-medium">Muestras Totales</p>
                  <p className="text-3xl font-bold">
                    {isLoadingSamples ? (
                      <Skeleton className="h-8 w-16 bg-navy-400" />
                    ) : (
                      stats?.totalSamples || 0
                    )}
                  </p>
                </div>
                <div className="bg-navy-400 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-navy-700 to-navy-800 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-navy-100 text-sm font-medium">Análisis Completados</p>
                  <p className="text-3xl font-bold">
                    {isLoadingSamples ? (
                      <Skeleton className="h-8 w-16 bg-navy-400" />
                    ) : (
                      stats?.completedSamples || 0
                    )}
                  </p>
                </div>
                <div className="bg-navy-600 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-navy-800 to-navy-900 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-navy-100 text-sm font-medium">Tasa de Éxito</p>
                  <p className="text-3xl font-bold">
                    {isLoadingSamples ? (
                      <Skeleton className="h-8 w-16 bg-navy-400" />
                    ) : (
                      `${stats?.totalSamples > 0 ? Math.round((stats.completedSamples / stats.totalSamples) * 100) : 0}%`
                    )}
                  </p>
                </div>
                <div className="bg-navy-700 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="navy-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy-700">
                <BarChart3 className="h-5 w-5" />
                Distribución de Estados de Lotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingLots ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0369a1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="navy-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy-700">
                <Users className="h-5 w-5" />
                Estado de Muestras
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSamples ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="navy-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-navy-700">
                <Clock className="h-5 w-5" />
                Lotes Recientes
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => navigate('/genetics/lots')}
                className="border-navy-200 text-navy-600 hover:bg-navy-50"
              >
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingLots ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-navy-100">
                      <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                        Variedad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {recentLots.map((lot: any) => (
                      <tr key={lot.id} className="hover:bg-navy-25 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lot.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {lot.variety?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {lot.status === 'superior' && (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Superior
                            </Badge>
                          )}
                          {lot.status === 'standard' && (
                            <Badge className="bg-navy-100 text-navy-800 hover:bg-navy-200">
                              <PackageCheck className="h-4 w-4 mr-2" />
                              Estándar
                            </Badge>
                          )}
                          {lot.status === 'retenido' && (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Retenido
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-navy-200 text-navy-600 hover:bg-navy-50"
                          >
                            Ver detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneticsCompanyDashboard;
