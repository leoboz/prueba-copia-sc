
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 8 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Update the user's password_changed_at and requires_password_change fields
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({
            password_changed_at: new Date().toISOString(),
            requires_password_change: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      }

      toast({
        title: 'Éxito',
        description: 'Contraseña actualizada correctamente. Serás redirigido al login.',
      });

      // Sign out the user and redirect to login
      await supabase.auth.signOut();
      
      // Wait a moment for the toast to be visible, then redirect
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);

    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md navy-card">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto bg-gradient-to-br from-navy-500 to-navy-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-serif text-navy-900">
            Cambiar Contraseña
          </CardTitle>
          <p className="text-navy-600 mt-2">
            Por favor, establece una nueva contraseña segura
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-navy-900 font-medium">
                Nueva Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 h-4 w-4" />
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  className="pl-10 pr-10 border-navy-200 focus:border-navy-600 focus:ring-navy-600"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-navy-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-navy-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-navy-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-navy-900 font-medium">
                Confirmar Nueva Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  className="pl-10 pr-10 border-navy-200 focus:border-navy-600 focus:ring-navy-600"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-navy-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-navy-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-navy-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="bg-navy-50 border border-navy-200 rounded-lg p-4">
              <h4 className="font-medium text-navy-800 mb-2">Requisitos de contraseña:</h4>
              <ul className="text-sm text-navy-600 space-y-1">
                <li>• Mínimo 8 caracteres</li>
                <li>• Se recomienda incluir mayúsculas, minúsculas y números</li>
                <li>• Evita información personal obvia</li>
              </ul>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3"
            >
              {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
