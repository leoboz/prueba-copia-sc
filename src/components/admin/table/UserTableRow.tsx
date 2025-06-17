
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, UserX, UserCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AdminUser } from '@/hooks/useAdminUsers';
import UserRoleBadge from '../UserRoleBadge';
import UserStatusIndicator from '../UserStatusIndicator';

interface UserTableRowProps {
  user: AdminUser;
  userCompanies: Array<{
    company?: { name: string; code: string };
    role: string;
  }>;
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  userCompanies,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TableRow className="hover:bg-navy-50/50 transition-colors border-navy-100">
      <TableCell className="font-medium text-navy-900">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-navy-500 to-navy-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
          <span>{user.name || 'Sin nombre'}</span>
        </div>
      </TableCell>
      <TableCell className="text-navy-700">{user.email}</TableCell>
      <TableCell>
        <UserRoleBadge 
          role={user.role} 
          userCompanies={userCompanies} 
        />
      </TableCell>
      <TableCell>
        <UserStatusIndicator 
          isActive={user.is_active} 
          lastLogin={user.last_login_at} 
        />
      </TableCell>
      <TableCell className="text-navy-600 text-sm">{formatDate(user.last_login_at)}</TableCell>
      <TableCell className="text-navy-600 text-sm">{formatDate(user.created_at)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-navy-100 text-navy-600"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-navy-200 shadow-xl">
            <DropdownMenuItem 
              onClick={() => onEdit(user)}
              className="text-navy-700 hover:bg-navy-50"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onToggleStatus(user)}
              className="text-navy-700 hover:bg-navy-50"
            >
              {user.is_active ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(user)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
