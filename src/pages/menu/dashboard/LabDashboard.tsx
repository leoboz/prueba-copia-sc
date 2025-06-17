
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useFetchSamples } from '@/hooks/useFetchSamples';
import { 
  TestTube, 
  Clock, 
  CheckCircle, 
  Beaker,
  BarChart3,
  FileText
} from 'lucide-react';
import StandardPageHeader from '@/components/common/StandardPageHeader';

const LabDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { samples } = useFetchSamples();

  // Filter samples for current lab user
  const userSamples = React.useMemo(() => {
    if (!samples || !user) return [];
    return samples.filter(sample => sample.userId === user.id);
  }, [samples, user]);

  // Calculate metrics
  const stats = React.useMemo(() => {
    const total = userSamples.length;
    const pending = userSamples.filter(s => ['received', 'confirmed'].includes(s.status)).length;
    const testing = userSamples.filter(s => s.status === 'testing').length;
    const completed = userSamples.filter(s => s.status === 'completed').length;
    
    return { total, pending, testing, completed };
  }, [userSamples]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StandardPageHeader
          title="Panel de Control - Laboratorio"
          subtitle="Gestione las muestras asignadas y monitoree el progreso de los análisis"
          icon={BarChart3}
          backgroundGradient="from-navy-900 via-navy-800 to-navy-900"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/samples')}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
            >
              <TestTube className="h-5 w-5 mr-2" />
              Ver Muestras
            </Button>
          </div>
        </StandardPageHeader>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Muestras</CardTitle>
              <TestTube className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Pendientes</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">En Análisis</CardTitle>
              <Beaker className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{stats.testing}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Completadas</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-navy-200/40 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-navy-900 flex items-center">
              <TestTube className="h-6 w-6 mr-3 text-navy-700" />
              Análisis de Muestras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-navy-600">
              Acceda a todas las muestras asignadas a su laboratorio para análisis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/samples')}
                className="flex-1 bg-navy-600 hover:bg-navy-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Ver Todas las Muestras
              </Button>
              {stats.pending > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/samples')}
                  className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {stats.pending} Pendientes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
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
                            Código: {sample.internal_code || 'Sin código'}
                          </p>
                          <p className="text-sm text-navy-600">
                            Cultivo: {sample.lot?.variety?.crop?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-navy-500">
                            Estado: {sample.status === 'completed' ? 'Completada' : 
                                    sample.status === 'testing' ? 'En análisis' : 
                                    sample.status === 'received' ? 'Recibida' : 'Pendiente'}
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

export default LabDashboard;
