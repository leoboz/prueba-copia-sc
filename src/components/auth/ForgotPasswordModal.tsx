
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: 'Correo enviado',
        description: 'Revisa tu correo electrónico para las instrucciones de restablecimiento.',
      });
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

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {emailSent ? 'Correo enviado' : 'Restablecer contraseña'}
          </DialogTitle>
          <DialogDescription>
            {emailSent
              ? 'Te hemos enviado un enlace para restablecer tu contraseña.'
              : 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.'}
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-countryside-brown" />
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-countryside-green hover:bg-countryside-green-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800">
                Si existe una cuenta con ese correo electrónico, recibirás un enlace de restablecimiento.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Entendido
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
