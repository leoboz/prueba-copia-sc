
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Building, Eye, EyeOff, Copy } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'geneticsCompany', label: 'Compañía Genética' },
  { value: 'multiplier', label: 'Multiplicador' },
  { value: 'lab', label: 'Laboratorio' },
  { value: 'farmer', label: 'Agricultor' }
];

const UserCreateModal: React.FC<UserCreateModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'farmer',
    companyName: ''
  });
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔨 Calling create-user function with:', formData);
      
      // Get the current session to pass the auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call the edge function to create the user
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create user');
      }

      console.log('✅ User created successfully:', data);
      setGeneratedPassword(data.temporaryPassword);
      
      // Invalidate the admin users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      toast({
        title: 'Usuario creado exitosamente',
        description: `El usuario ${formData.name} ha sido creado. Guarde la contraseña temporal mostrada.`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'farmer',
        companyName: ''
      });
    } catch (error: any) {
      console.error('❌ Error creating user:', error);
      toast({
        title: 'Error al crear usuario',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      toast({
        title: 'Contraseña copiada',
        description: 'La contraseña temporal ha sido copiada al portapapeles',
      });
    }
  };

  const handleClose = () => {
    setGeneratedPassword(null);
    setShowPassword(false);
    setFormData({
      name: '',
      email: '',
      role: 'farmer',
      companyName: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-navy-900 font-serif text-xl">
            {generatedPassword ? 'Usuario Creado' : 'Crear Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>

        {generatedPassword ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Contraseña Temporal Generada
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                Esta contraseña solo se mostrará una vez. El usuario deberá cambiarla en su primer inicio de sesión.
              </p>
              
              <div className="flex items-center space-x-2 bg-white rounded border p-3">
                <code className="flex-1 font-mono text-sm">
                  {showPassword ? generatedPassword : '•'.repeat(generatedPassword.length)}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Próximos pasos:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Proporcione estas credenciales al usuario</li>
                <li>2. El usuario debe iniciar sesión con su email y la contraseña temporal</li>
                <li>3. Se le solicitará cambiar la contraseña en el primer acceso</li>
              </ol>
            </div>

            <Button onClick={handleClose} className="w-full">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-navy-800 font-medium">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre completo del usuario"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-800 font-medium">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@empresa.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-navy-800 font-medium">Empresa (Opcional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
                <Input
                  id="company"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Nombre de la empresa"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-navy-800 font-medium">Rol del Usuario</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-navy-600 hover:bg-navy-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateModal;
