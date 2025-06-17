
import React from 'react';
import { Users } from 'lucide-react';

interface UsersTableEmptyProps {
  searchTerm: string;
}

const UsersTableEmpty: React.FC<UsersTableEmptyProps> = ({ searchTerm }) => {
  return (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-navy-300 mb-4" />
      <h3 className="text-lg font-serif text-navy-900 mb-2">No se encontraron usuarios</h3>
      <p className="text-navy-600">
        {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'No hay usuarios registrados en el sistema.'}
      </p>
    </div>
  );
};

export default UsersTableEmpty;
