
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import UsersTable from '@/components/admin/UsersTable';
import UserCreateModal from '@/components/admin/UserCreateModal';
import UserEditModal from '@/components/admin/UserEditModal';
import { Plus, Users, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const UsersManagement = () => {
  const { user: currentUser } = useAuth();
  const {
    users,
    isLoadingUsers,
    toggleUserStatus
  } = useAdminUsers();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  if (isLoadingUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="navy-card p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-navy-600" />
            <p className="text-navy-700">Cargando usuarios...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-serif flex items-center mb-2">
                  <Users className="mr-4 h-10 w-10" />
                  Gestión de Usuarios
                </h1>
                <p className="text-navy-100 text-lg">
                  Administre los usuarios del sistema y sus asociaciones con empresas
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-navy-900 hover:bg-navy-50 shadow-lg transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Crear Usuario
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table Card */}
        <Card className="navy-card">
          <CardHeader className="bg-gradient-to-r from-navy-50 to-white border-b border-navy-200/20">
            <CardTitle className="text-2xl font-serif text-navy-900 flex items-center">
              <Users className="mr-3 h-6 w-6 text-navy-600" />
              Usuarios del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <UsersTable users={users || []} />
          </CardContent>
        </Card>

        <UserCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />

        {selectedUser && (
          <UserEditModal
            user={selectedUser}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
