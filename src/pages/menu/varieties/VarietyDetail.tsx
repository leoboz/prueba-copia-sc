
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGenetics } from '@/hooks/useGenetics';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Sprout, Edit3, Calendar, User } from 'lucide-react';

const VarietyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companyVarieties, isLoadingCompanyVarieties } = useGenetics();
  const { user } = useAuth();

  const variety = companyVarieties?.find(v => v.id === id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <h2 className="text-xl font-medium text-red-600 mb-4">Acceso denegado</h2>
            <p className="text-red-700">Debe iniciar sesión para acceder a esta página.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoadingCompanyVarieties) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
            <p className="text-navy-700">Cargando variedad...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!variety) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <h2 className="text-xl font-medium text-red-600 mb-4">Variedad no encontrada</h2>
            <p className="text-red-700 mb-4">La variedad que busca no existe o no tiene permisos para verla.</p>
            <Button onClick={() => navigate('/varieties')} className="bg-navy-900 hover:bg-navy-800">
              Volver a Variedades
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/varieties')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sprout className="h-8 w-8" />
                <div>
                  <h1 className="text-4xl font-bold">{variety.name}</h1>
                  <p className="text-navy-100 text-lg">Detalles de la variedad</p>
                </div>
              </div>
              {user.role === 'geneticsCompany' && variety.createdBy === user.id && (
                <Button
                  onClick={() => navigate(`/varieties/${variety.id}/edit`)}
                  className="bg-white text-navy-600 hover:bg-navy-50"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="navy-card mb-6">
              <CardHeader>
                <CardTitle className="text-navy-700 flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-navy-600">Nombre</label>
                  <p className="text-lg font-semibold text-gray-900">{variety.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-navy-600">Cultivo</label>
                  <Badge variant="secondary" className="bg-navy-100 text-navy-700 ml-2">
                    {variety.crop?.name || 'Sin especificar'}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-navy-600">Descripción</label>
                  <p className="text-gray-700 mt-1">
                    {variety.description || 'Sin descripción disponible'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="navy-card">
              <CardHeader>
                <CardTitle className="text-navy-700 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Información de Creación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-navy-600">Fecha de Creación</label>
                  <p className="text-gray-700">
                    {new Date(variety.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-navy-600">Última Actualización</label>
                  <p className="text-gray-700">
                    {new Date(variety.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-navy-600">ID de Variedad</label>
                  <p className="text-xs text-gray-500 font-mono">{variety.id}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VarietyDetail;
