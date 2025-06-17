
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Sprout, Lock, Mail, QrCode, Search } from 'lucide-react';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

const Login = () => {
  const { login, isAuthenticated, isLoading, requiresPasswordChange, error: authError } = useAuth();
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect based on password change requirement
  if (isAuthenticated) {
    console.log('User is authenticated, checking password change requirement...');
    if (requiresPasswordChange) {
      return <Navigate to="/change-password" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      console.log('Login attempt completed, checking auth state...');
      // The AuthContext will handle navigation via the auth state change listener
      setTimeout(() => {
        if (requiresPasswordChange) {
          navigate('/change-password', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 100);
    } catch (error) {
      console.error('Login submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-50 via-white to-navy-100 p-4 md:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-navy-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-navy-300/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-radial from-navy-100/15 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-4 bg-gradient-to-br from-navy-900 to-navy-800 rounded-full shadow-2xl">
              <Sprout className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">SeedQuality</h1>
          </div>
        </div>
        
        <Card className="bg-white/90 backdrop-blur-sm border border-navy-100/50 shadow-2xl">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">Iniciar Sesión</h2>
              <p className="text-navy-600">Acceda a su cuenta del sistema</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-navy-800 font-medium">Correo Electrónico</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400 group-focus-within:text-navy-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="pl-10 h-11 border-navy-200 focus:border-navy-500 focus:ring-navy-500 bg-white/80"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-navy-800 font-medium">Contraseña</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-navy-600 hover:text-navy-800 transition-colors font-medium"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400 group-focus-within:text-navy-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="pl-10 h-11 border-navy-200 focus:border-navy-500 focus:ring-navy-500 bg-white/80"
                    required
                  />
                </div>
              </div>
              
              {authError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-600">
                  {authError}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-navy-900 to-navy-800 hover:from-navy-800 hover:to-navy-700 h-11 shadow-lg transition-all duration-200 hover:shadow-xl"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        </Card>
        
        {/* Add lot lookup link */}
        <div className="mt-6 text-center">
          <Link
            to="/lot-lookup"
            className="inline-flex items-center space-x-2 text-navy-600 hover:text-navy-800 transition-colors font-medium"
          >
            <QrCode className="h-4 w-4" />
            <span>Consultar Lote sin Registro</span>
            <Search className="h-4 w-4" />
          </Link>
        </div>
        
        <p className="mt-4 text-center text-navy-500 text-sm">
          © 2025 SeedQuality - Sistema de Gestión de Calidad de Semillas
        </p>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default Login;
