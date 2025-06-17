import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { AdminUser, useAdminUsers } from '@/hooks/useAdminUsers';
import UserEditModal from './UserEditModal';
import UserDeleteDialog from './UserDeleteDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformUserCompanyAssociation } from '@/utils/dataTransformers';
import UsersTableSearch from './table/UsersTableSearch';
import UsersTableHeader from './table/UsersTableHeader';
import UserTableRow from './table/UserTableRow';
import UsersTableEmpty from './table/UsersTableEmpty';

interface UsersTableProps {
  users: AdminUser[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  
  const { toggleUserStatus, deleteUser } = useAdminUsers();

  // Fetch user company associations for all users
  const { data: userCompanyAssociations } = useQuery({
    queryKey: ['all-user-company-associations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_company_associations')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data?.map(transformUserCompanyAssociation) || [];
    },
  });

  const getUserCompanyAssociations = (userId: string) => {
    return userCompanyAssociations?.filter(assoc => assoc.userId === userId) || [];
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getUserCompanyAssociations(user.id).some(assoc => 
      assoc.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assoc.company?.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await toggleUserStatus.mutateAsync({
        userId: user.id,
        isActive: !user.is_active
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = (user: AdminUser) => {
    console.log('Setting user to delete:', user);
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) {
      console.error('No user selected for deletion');
      return;
    }
    
    console.log('Confirming deletion of user:', userToDelete.id);
    
    try {
      await deleteUser.mutateAsync(userToDelete.id);
      // Close dialog and reset state
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error in confirm delete user:', error);
      // Keep dialog open on error so user can try again
    }
  };

  return (
    <div className="space-y-6">
      <UsersTableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredCount={filteredUsers.length}
        totalCount={users.length}
      />

      <div className="navy-card border-0 overflow-hidden">
        <Table>
          <UsersTableHeader />
          <TableBody>
            {filteredUsers.map((user) => {
              const userCompanies = getUserCompanyAssociations(user.id);
              return (
                <UserTableRow
                  key={user.id}
                  user={user}
                  userCompanies={userCompanies}
                  onEdit={handleEditUser}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteUser}
                />
              );
            })}
          </TableBody>
        </Table>
        
        {filteredUsers.length === 0 && (
          <UsersTableEmpty searchTerm={searchTerm} />
        )}
      </div>

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
      />

      <UserDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        user={userToDelete}
        onConfirm={confirmDeleteUser}
        isDeleting={deleteUser.isPending}
      />
    </div>
  );
};

export default UsersTable;
