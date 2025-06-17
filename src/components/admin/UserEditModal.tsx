
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAdminUsers, AdminUser } from '@/hooks/useAdminUsers';
import { User, Mail, ToggleLeft } from 'lucide-react';
import UserCompanyAssociations from './UserCompanyAssociations';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const { toggleUserStatus } = useAdminUsers();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setIsActive(user.is_active || false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {      
      if (isActive !== user.is_active) {
        await toggleUserStatus.mutateAsync({ userId: user.id, isActive });
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl navy-card border-navy-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto bg-gradient-to-br from-navy-500 to-navy-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-serif text-navy-900">
            Editar Usuario
          </DialogTitle>
          <DialogDescription className="text-navy-600">
            Modifica la información y asociaciones del usuario seleccionado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic User Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-navy-900 border-b border-navy-200 pb-2">
              Información Básica
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-navy-900 font-medium">
                  Nombre del Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 h-4 w-4" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre del usuario"
                    className="pl-10 border-navy-200 bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>
                <p className="text-xs text-navy-500">Este campo no se puede editar</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-navy-900 font-medium">
                  Dirección de Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    className="pl-10 border-navy-200 bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>
                <p className="text-xs text-navy-500">Este campo no se puede editar</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-navy-50 rounded-lg border border-navy-200">
                <div className="flex items-center space-x-3">
                  <ToggleLeft className="h-5 w-5 text-navy-600" />
                  <div>
                    <Label htmlFor="isActive" className="text-navy-900 font-medium">
                      Estado del Usuario
                    </Label>
                    <p className="text-sm text-navy-600">
                      {isActive ? 'El usuario puede acceder al sistema' : 'El usuario no puede acceder al sistema'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="data-[state=checked]:bg-navy-600"
                />
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="border-navy-200 text-navy-600 hover:bg-navy-50"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={toggleUserStatus.isPending}
                  className="bg-navy-600 hover:bg-navy-700 text-white"
                >
                  {toggleUserStatus.isPending ? 'Guardando cambios...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </div>

          {/* Company Associations */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-navy-900 border-b border-navy-200 pb-2">
              Gestión de Empresas
            </h3>
            <UserCompanyAssociations user={user} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
