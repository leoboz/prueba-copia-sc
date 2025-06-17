
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Building, ChevronDown, Check } from 'lucide-react';

const roleLabels = {
  geneticsCompany: 'Empresa Genética',
  multiplier: 'Multiplicador',
  lab: 'Laboratorio',
  farmer: 'Productor'
};

const CompanySwitcher: React.FC = () => {
  const { userCompanies, activeCompany, switchCompany, isLoading } = useAuth();

  if (!userCompanies.length) {
    return null;
  }

  const handleCompanySwitch = async (companyId: string) => {
    try {
      await switchCompany(companyId);
    } catch (error) {
      console.error('Error switching company:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 h-auto p-2 hover:bg-navy-50"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-navy-100 rounded-md">
              <Building className="h-4 w-4 text-navy-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-navy-800 line-clamp-1">
                {activeCompany?.name || 'Seleccionar empresa'}
              </p>
              {activeCompany && (
                <p className="text-xs text-navy-500">
                  {roleLabels[activeCompany.role as keyof typeof roleLabels]}
                </p>
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-navy-500" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="font-medium text-navy-700">
          Cambiar Empresa
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {userCompanies.map((association) => (
          <DropdownMenuItem
            key={association.id}
            onClick={() => handleCompanySwitch(association.companyId)}
            className="flex items-center justify-between p-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-navy-100 rounded-md">
                <Building className="h-3 w-3 text-navy-600" />
              </div>
              <div>
                <p className="font-medium text-navy-800 text-sm">
                  {association.company?.name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {roleLabels[association.role as keyof typeof roleLabels]}
                  </Badge>
                  <span className="text-xs text-navy-500">
                    {association.company?.code}
                  </span>
                </div>
              </div>
            </div>
            {activeCompany?.id === association.companyId && (
              <Check className="h-4 w-4 text-navy-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CompanySwitcher;
