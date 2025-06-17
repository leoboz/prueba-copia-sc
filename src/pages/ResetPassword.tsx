
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required tokens
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      toast({
        title: 'Enlace inválido',
        description: 'El enlace de restablecimiento es inválido o ha expirado.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido actualizada exitosamente.',
      });

      // Redirect to login page
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-countryside-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-countryside-green/20 rounded-full mb-6">
            <Sprout className="h-12 w-12 text-countryside-green-dark" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-countryside-soil mb-2">
            GDM Seeds
          </h1>
          <h2 className="text-xl font-medium text-countryside-green-dark mb-2">
            Restablecer Contraseña
          </h2>
          <p className="text-countryside-brown">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <Card className="countryside-card p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-countryside-soil">Nueva Contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-countryside-soil">
                  Nueva contraseña
                </Label>
                <div className="flex items-center border border-countryside-brown/30 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-countryside-green">
                  <div className="px-3 py-3 bg-countryside-cream/30 border-r border-countryside-brown/20">
                    <Lock className="h-5 w-5 text-countryside-brown" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="border-0 focus-visible:ring-0 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 py-3 text-countryside-brown hover:text-countryside-soil"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-countryside-soil">
                  Confirmar contraseña
                </Label>
                <div className="flex items-center border border-countryside-brown/30 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-countryside-green">
                  <div className="px-3 py-3 bg-countryside-cream/30 border-r border-countryside-brown/20">
                    <Lock className="h-5 w-5 text-countryside-brown" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="border-0 focus-visible:ring-0 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="px-3 py-3 text-countryside-brown hover:text-countryside-soil"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-countryside-green hover:bg-countryside-green-dark h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-countryside-brown">
            © 2025 GDM Seeds - Sistema de Gestión de Calidad de Semillas
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
