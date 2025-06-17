
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sprout, FlaskConical, QrCode, Search } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return (
    <div className="min-h-screen bg-countryside-cream">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-countryside-amber/20 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-12 relative">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-countryside-green-dark" />
            <h1 className="text-2xl font-serif font-bold text-countryside-soil">GDM Seeds</h1>
          </div>
          
          <Button
            className="bg-countryside-green hover:bg-countryside-green-dark"
            onClick={() => navigate('/')}
          >
            Iniciar Sesión
          </Button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-countryside-soil mb-4">
              Sistema de <span className="text-countryside-green-dark">Gestión de Calidad</span> de Semillas
            </h2>
            <p className="text-countryside-brown-dark mb-6">
              Una plataforma integral para empresas genéticas, multiplicadores y laboratorios que garantiza la calidad y trazabilidad de las semillas.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                className="bg-countryside-green hover:bg-countryside-green-dark"
                onClick={() => navigate('/')}
              >
                Acceder a la plataforma
              </Button>
              <Button
                variant="outline"
                className="border-countryside-brown/30 text-countryside-soil hover:bg-white/70"
                onClick={() => navigate('/lot-lookup')}
              >
                <Search className="h-4 w-4 mr-2" />
                Consultar Lote
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1517022812141-23620dba5c23"
              alt="Campos de cultivo"
              className="rounded-xl shadow-lg"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-lg shadow-md border border-countryside-brown/10">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-countryside-green-dark" />
                </div>
                <div>
                  <p className="text-xs text-countryside-brown">Calidad Superior</p>
                  <p className="text-sm font-bold text-countryside-soil">97% PG · 99.7% Pureza</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="countryside-card p-6">
            <div className="p-3 bg-countryside-green/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <FlaskConical className="h-6 w-6 text-countryside-green-dark" />
            </div>
            <h3 className="text-xl font-serif font-medium text-countryside-soil mb-2">Pruebas de Calidad</h3>
            <p className="text-countryside-brown-dark">
              Gestione pruebas de poder germinativo, vigor, pureza y peso de mil semillas con validaciones automáticas.
            </p>
          </div>
          
          <div className="countryside-card p-6">
            <div className="p-3 bg-countryside-amber/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <QrCode className="h-6 w-6 text-countryside-amber-dark" />
            </div>
            <h3 className="text-xl font-serif font-medium text-countryside-soil mb-2">Códigos QR</h3>
            <p className="text-countryside-brown-dark">
              Genere códigos QR para cada lote que permiten a los agricultores acceder a información detallada de calidad.
            </p>
          </div>
          
          <div className="countryside-card p-6">
            <div className="p-3 bg-countryside-brown/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <BarChartBig className="h-6 w-6 text-countryside-brown-dark" />
            </div>
            <h3 className="text-xl font-serif font-medium text-countryside-soil mb-2">Estadísticas</h3>
            <p className="text-countryside-brown-dark">
              Visualice tendencias de calidad, rendimiento por región y otros indicadores clave para la toma de decisiones.
            </p>
          </div>
        </div>
        
        <footer className="border-t border-countryside-brown/10 pt-8 text-center">
          <p className="text-countryside-brown">
            © 2025 GDM Seeds - Sistema de Gestión de Calidad de Semillas
          </p>
        </footer>
      </div>
    </div>
  );
};

// Missing import
const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const BarChartBig = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <rect width="4" height="7" x="7" y="10" rx="1" />
    <rect width="4" height="12" x="15" y="5" rx="1" />
  </svg>
);

export default Index;
