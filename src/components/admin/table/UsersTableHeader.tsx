
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const UsersTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gradient-to-r from-navy-50 to-navy-100 hover:bg-navy-100 border-navy-200">
        <TableHead className="font-semibold text-navy-900">Usuario</TableHead>
        <TableHead className="font-semibold text-navy-900">Email</TableHead>
        <TableHead className="font-semibold text-navy-900">Empresas</TableHead>
        <TableHead className="font-semibold text-navy-900">Estado</TableHead>
        <TableHead className="font-semibold text-navy-900">Último acceso</TableHead>
        <TableHead className="font-semibold text-navy-900">Fecha registro</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UsersTableHeader;
