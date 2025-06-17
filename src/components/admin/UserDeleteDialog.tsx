
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AdminUser } from '@/hooks/useAdminUsers';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface UserDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isDeleting,
}) => {
  if (!user) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Eliminar Usuario
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-3">
            <p>
              ¿Está seguro que desea eliminar permanentemente al usuario{' '}
              <strong>{user.name || user.email}</strong>?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm font-medium mb-2">
                Esta acción eliminará completamente:
              </p>
              <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                <li>El usuario del sistema</li>
                <li>Todas sus asociaciones con empresas</li>
                <li>Sus sesiones activas</li>
                <li>Sus permisos de variedades</li>
                <li>Su historial de actividad</li>
              </ul>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              Esta acción no se puede deshacer.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isDeleting}
            className="border-gray-300"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Usuario
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserDeleteDialog;
