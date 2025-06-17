
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

interface UserStatusIndicatorProps {
  isActive: boolean | null;
  lastLogin: string | null;
}

const UserStatusIndicator: React.FC<UserStatusIndicatorProps> = ({ isActive, lastLogin }) => {
  const getStatusConfig = () => {
    if (!isActive) {
      return { 
        label: 'Inactivo', 
        badgeClass: 'bg-red-100 text-red-700 hover:bg-red-200',
        dotColor: 'text-red-500'
      };
    }
    
    if (!lastLogin) {
      return { 
        label: 'Nunca conectado', 
        badgeClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        dotColor: 'text-gray-500'
      };
    }

    const lastLoginDate = new Date(lastLogin);
    const daysSinceLogin = Math.floor((Date.now() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLogin <= 1) {
      return { 
        label: 'Activo', 
        badgeClass: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
        dotColor: 'text-emerald-500'
      };
    } else if (daysSinceLogin <= 7) {
      return { 
        label: 'Reciente', 
        badgeClass: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
        dotColor: 'text-amber-500'
      };
    } else {
      return { 
        label: 'Inactivo', 
        badgeClass: 'bg-navy-100 text-navy-700 hover:bg-navy-200',
        dotColor: 'text-navy-500'
      };
    }
  };

  const { label, badgeClass, dotColor } = getStatusConfig();

  return (
    <div className="flex items-center gap-2">
      <Circle className={`h-2 w-2 fill-current ${dotColor}`} />
      <Badge className={badgeClass}>
        {label}
      </Badge>
    </div>
  );
};

export default UserStatusIndicator;
