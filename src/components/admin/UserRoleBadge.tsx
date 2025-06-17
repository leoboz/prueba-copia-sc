
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';

interface UserRoleBadgeProps {
  role: string | null;
  userCompanies?: Array<{
    company?: { name: string; code: string };
    role: string;
  }>;
}

const roleLabels = {
  admin: 'Administrador',
  lab: 'Laboratorio',
  multiplier: 'Multiplicador',
  geneticsCompany: 'Empresa Genética',
  farmer: 'Agricultor'
};

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role, userCompanies }) => {
  // If user has company associations, show those instead of legacy role
  if (userCompanies && userCompanies.length > 0) {
    return (
      <div className="flex flex-wrap gap-1">
        {userCompanies.map((association, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="bg-navy-50 border-navy-200 text-navy-700 text-xs"
          >
            <Building className="h-3 w-3 mr-1" />
            {association.company?.code || 'N/A'}
          </Badge>
        ))}
      </div>
    );
  }

  // Fallback to legacy role display
  const getRoleConfig = (role: string | null) => {
    switch (role) {
      case 'admin':
        return { 
          label: 'Administrador', 
          className: 'bg-red-500 text-white hover:bg-red-600' 
        };
      case 'lab':
        return { 
          label: 'Laboratorio', 
          className: 'bg-navy-600 text-white hover:bg-navy-700' 
        };
      case 'multiplier':
        return { 
          label: 'Multiplicador', 
          className: 'bg-navy-500 text-white hover:bg-navy-600' 
        };
      case 'geneticsCompany':
        return { 
          label: 'Empresa Genética', 
          className: 'bg-navy-400 text-white hover:bg-navy-500' 
        };
      case 'farmer':
        return { 
          label: 'Agricultor', 
          className: 'bg-emerald-500 text-white hover:bg-emerald-600' 
        };
      default:
        return { 
          label: 'Sin empresas', 
          className: 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
        };
    }
  };

  const { label, className } = getRoleConfig(role);

  return (
    <Badge className={className}>
      {label}
    </Badge>
  );
};

export default UserRoleBadge;
