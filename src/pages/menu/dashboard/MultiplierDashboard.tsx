
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLots } from '@/hooks/useLots';
import { useFetchSamples } from '@/hooks/useFetchSamples';
import { 
  Package, 
  TestTube, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  BarChart3
} from 'lucide-react';
import StandardPageHeader from '@/components/common/StandardPageHeader';

const MultiplierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lots } = useLots();
  const { samples } = useFetchSamples();

  // Filter data for current multiplier user
  const userLots = lots?.filter(lot => lot.userId === user?.id) || [];
  const userLotIds = userLots.map(lot => lot.id);
  const userSamples = samples?.filter(sample => userLotIds.includes(sample.lotId)) || [];

  // Calculate metrics
  const totalLots = userLots.length;
  const activeLots = userLots.filter(lot => lot.status !== 'retenido').length;
  const totalSamples = userSamples.length;
  const completedSamples = userSamples.filter(sample => sample.status === 'completed').length;
  const pendingSamples = userSamples.filter(sample => 
    ['submitted', 'received', 'confirmed', 'testing'].includes(sample.status)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StandardPageHeader
          title="Panel de Control"
          subtitle="Gestione sus lotes y monitoree el estado de sus muestras"
          icon={BarChart3}
          backgroundGradient="from-navy-900 via-navy-800 to-navy-900"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/lots/create')}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear Lote
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/lots')}
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Package className="h-5 w-5 mr-2" />
              Ver Lotes
            </Button>
          </div>
        </StandardPageHeader>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total de Lotes</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalLots}</div>
              <p className="text-xs text-blue-600 mt-1">
                {activeLots} activos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Muestras Completadas</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{completedSamples}</div>
              <p className="text-xs text-green-600 mt-1">
                de {totalSamples} total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Muestras Pendientes</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{pendingSamples}</div>
              <p className="text-xs text-orange-600 mt-1">
                en proceso
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Tasa de Éxito</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                {totalSamples > 0 ? Math.round((completedSamples / totalSamples) * 100) : 0}%
              </div>
              <p className="text-xs text-purple-600 mt-1">
                muestras aprobadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-navy-200/40 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-navy-900 flex items-center">
                <Package className="h-6 w-6 mr-3 text-navy-700" />
                Gestión de Lotes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-navy-600">
                Administre sus lotes de semillas, cree nuevos lotes y monitoree su estado.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/lots')}
                  className="flex-1 bg-navy-600 hover:bg-navy-700"
                >
                  Ver Mis Lotes
                </Button>
                <Button 
                  onClick={() => navigate('/lots/create')}
                  variant="outline"
                  className="flex-1 border-navy-300 text-navy-700 hover:bg-navy-50"
                >
                  Crear Nuevo Lote
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-navy-200/40 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-navy-900 flex items-center">
                <TestTube className="h-6 w-6 mr-3 text-navy-700" />
                Análisis de Muestras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-navy-600">
                Monitoree el progreso de sus muestras y revise los resultados de laboratorio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/samples')}
                  className="flex-1 bg-navy-600 hover:bg-navy-700"
                >
                  Ver Mis Muestras
                </Button>
                {pendingSamples > 0 && (
                  <Button 
                    variant="outline"
                    className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {pendingSamples} Pendientes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        {userSamples.length > 0 && (
          <Card className="mt-8 border-navy-200/40 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-navy-900">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userSamples
                  .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                  .slice(0, 5)
                  .map((sample) => (
                    <div key={sample.id} className="flex items-center justify-between p-4 bg-navy-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TestTube className="h-5 w-5 text-navy-600" />
                        <div>
                          <p className="font-medium text-navy-900">
                            Muestra - Lote {sample.lot?.code || 'N/A'}
                          </p>
                          <p className="text-sm text-navy-600">
                            Estado: {sample.status === 'completed' ? 'Completada' : 
                                    sample.status === 'testing' ? 'En análisis' : 
                                    sample.status === 'received' ? 'Recibida' : 'Enviada'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-navy-500">
                        {new Date(sample.updatedAt || sample.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiplierDashboard;
