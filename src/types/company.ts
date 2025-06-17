
export interface Company {
  id: string;
  name: string;
  code: string;
  role: 'geneticsCompany' | 'multiplier' | 'lab' | 'farmer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCompanyAssociation {
  id: string;
  userId: string;
  companyId: string;
  role: 'geneticsCompany' | 'multiplier' | 'lab' | 'farmer';
  isActive: boolean;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  activeCompanyId: string;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithCompanies {
  id: string;
  name: string;
  email: string;
  isSystemAdmin: boolean;
  companies: UserCompanyAssociation[];
  activeCompany?: Company;
  activeRole?: string;
}
