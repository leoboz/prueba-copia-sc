
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus, FileText, Clock, CheckCircle } from 'lucide-react';

const ClaimsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-navy-50/30 via-white to-navy-100/20 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white p-8 rounded-2xl shadow-2xl border border-navy-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold drop-shadow-sm mb-2">
                Gestión de Reclamos
              </h1>
              <p className="text-navy-200/90 text-lg font-medium">
                Sistema de seguimiento y resolución de reclamos
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl border border-white/20">
              <AlertTriangle className="h-12 w-12 text-white drop-shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30">
          <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
            <CardTitle className="flex items-center text-xl font-serif">
              <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
              <FileText className="h-6 w-6 mr-3" />
              Próximamente Disponible
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="p-6 bg-gradient-to-br from-navy-100 to-navy-50 rounded-2xl inline-block">
                <AlertTriangle className="h-16 w-16 text-navy-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">
              Módulo en Desarrollo
            </h3>
            <p className="text-navy-700 mb-6 text-lg leading-relaxed">
              El sistema de gestión de reclamos está en desarrollo activo. 
              Pronto podrás gestionar, hacer seguimiento y resolver reclamos de manera eficiente.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-navy-600 bg-navy-50 p-3 rounded-xl">
                <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                <span>Registro de reclamos</span>
              </div>
              <div className="flex items-center text-navy-600 bg-navy-50 p-3 rounded-xl">
                <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                <span>Seguimiento de estado</span>
              </div>
              <div className="flex items-center text-navy-600 bg-navy-50 p-3 rounded-xl">
                <Clock className="h-5 w-5 mr-3 text-amber-600" />
                <span>Sistema de notificaciones</span>
              </div>
              <div className="flex items-center text-navy-600 bg-navy-50 p-3 rounded-xl">
                <Clock className="h-5 w-5 mr-3 text-amber-600" />
                <span>Reportes y métricas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-navy-200/40 shadow-xl bg-gradient-to-br from-white to-navy-50/30">
          <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
            <CardTitle className="flex items-center text-xl font-serif">
              <div className="w-2 h-8 bg-gradient-to-b from-white to-navy-300 rounded-full mr-3"></div>
              <Plus className="h-6 w-6 mr-3" />
              Funcionalidades Planificadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="border-l-4 border-navy-600 pl-6">
                <h4 className="text-lg font-bold text-navy-900 mb-2">Registro de Reclamos</h4>
                <p className="text-navy-700">
                  Formulario completo para registrar reclamos con adjuntos, categorización y prioridad.
                </p>
              </div>
              
              <div className="border-l-4 border-navy-600 pl-6">
                <h4 className="text-lg font-bold text-navy-900 mb-2">Flujo de Trabajo</h4>
                <p className="text-navy-700">
                  Sistema de estados configurable con asignación automática y escalamiento.
                </p>
              </div>
              
              <div className="border-l-4 border-navy-600 pl-6">
                <h4 className="text-lg font-bold text-navy-900 mb-2">Dashboard de Métricas</h4>
                <p className="text-navy-700">
                  Visualización de tiempos de respuesta, satisfacción del cliente y tendencias.
                </p>
              </div>
              
              <div className="border-l-4 border-navy-600 pl-6">
                <h4 className="text-lg font-bold text-navy-900 mb-2">Comunicación</h4>
                <p className="text-navy-700">
                  Sistema de mensajería interna y notificaciones automáticas por email.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                disabled 
                className="bg-navy-600 hover:bg-navy-700 text-white px-8 py-3 rounded-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Reclamo (Próximamente)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClaimsPage;
