
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLots } from '@/hooks/useLots';
import { useSamples } from '@/hooks/useSamples';
import { Link } from 'react-router-dom';
import { Users, Settings, FileText, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { lots, isLoading: isLoadingLots } = useLots();
  const { samples, isLoading: isLoadingSamples } = useSamples();

  const stats = useMemo(() => {
    if (!lots || !samples) return null;

    const totalLots = lots.length;
    const lotsByStatus = {
      superior: lots.filter(lot => lot.status === 'superior').length,
      standard: lots.filter(lot => lot.status === 'standard').length,
      retenido: lots.filter(lot => lot.status === 'retenido').length,
    };

    const totalSamples = samples.length;
    const samplesByStatus = {
      submitted: samples.filter(sample => sample.status === 'submitted').length,
      received: samples.filter(sample => sample.status === 'received').length,
      confirmed: samples.filter(sample => sample.status === 'confirmed').length,
      testing: samples.filter(sample => sample.status === 'testing').length,
      completed: samples.filter(sample => sample.status === 'completed').length,
    };

    return {
      totalLots,
      lotsByStatus,
      totalSamples,
      samplesByStatus,
    };
  }, [lots, samples]);

  if (isLoadingLots || isLoadingSamples || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
            <p className="text-navy-700">Cargando datos del dashboard...</p>
          </Card>
        </div>
      </div>
    );
  }

  const sampleStatusData = [
    { name: 'Enviado', value: stats.samplesByStatus.submitted },
    { name: 'Recibido', value: stats.samplesByStatus.received },
    { name: 'Confirmado', value: stats.samplesByStatus.confirmed },
    { name: 'En Análisis', value: stats.samplesByStatus.testing },
    { name: 'Completado', value: stats.samplesByStatus.completed },
  ];

  const lotStatusData = [
    { name: 'Superior', value: stats.lotsByStatus.superior },
    { name: 'Estándar', value: stats.lotsByStatus.standard },
    { name: 'Retenido', value: stats.lotsByStatus.retenido },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-serif flex items-center mb-2">
                  <BarChart3 className="mr-4 h-10 w-10" />
                  Panel de Administración
                </h1>
                <p className="text-navy-100 text-lg">
                  Gestione el sistema y supervise las operaciones
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="navy-card hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gradient-to-br from-navy-500 to-navy-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-serif text-navy-900">
                Gestión de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-navy-600 mb-4">
                Administre usuarios, roles y permisos del sistema
              </p>
              <Link to="/admin/users">
                <Button className="bg-navy-600 hover:bg-navy-700 text-white w-full">
                  Gestionar Usuarios
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="navy-card hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gradient-to-br from-navy-500 to-navy-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-serif text-navy-900">
                Configuración del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-navy-600 mb-4">
                Configure parámetros globales y estándares
              </p>
              <Link to="/standards">
                <Button className="bg-navy-600 hover:bg-navy-700 text-white w-full">
                  Configurar Sistema
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="navy-card hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gradient-to-br from-navy-500 to-navy-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-serif text-navy-900">
                Plantillas de Pruebas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-navy-600 mb-4">
                Gestione las plantillas de pruebas del laboratorio
              </p>
              <Link to="/test-templates">
                <Button className="bg-navy-600 hover:bg-navy-700 text-white w-full">
                  Ver Plantillas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="navy-card">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-navy-900">
                Estado de Lotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lotStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="navy-card">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-navy-900">
                Estado de Muestras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="navy-card">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-navy-900 mb-2">
                Total de Lotes
              </h3>
              <p className="text-3xl font-bold text-navy-600">
                {stats.totalLots}
              </p>
            </CardContent>
          </Card>

          <Card className="navy-card">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-navy-900 mb-2">
                Total de Muestras
              </h3>
              <p className="text-3xl font-bold text-navy-600">
                {stats.totalSamples}
              </p>
            </CardContent>
          </Card>

          <Card className="navy-card">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-navy-900 mb-2">
                Lotes Superiores
              </h3>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.lotsByStatus.superior}
              </p>
            </CardContent>
          </Card>

          <Card className="navy-card">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-navy-900 mb-2">
                Muestras Completadas
              </h3>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.samplesByStatus.completed}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
