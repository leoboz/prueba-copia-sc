
import { Company, UserCompanyAssociation, UserSession } from '@/types/company';

// Transform database company object to TypeScript interface
export const transformCompany = (dbCompany: any): Company => ({
  id: dbCompany.id,
  name: dbCompany.name,
  code: dbCompany.code,
  role: dbCompany.role,
  isActive: dbCompany.is_active,
  createdAt: dbCompany.created_at,
  updatedAt: dbCompany.updated_at,
});

// Transform database user company association to TypeScript interface
export const transformUserCompanyAssociation = (dbAssociation: any): UserCompanyAssociation => ({
  id: dbAssociation.id,
  userId: dbAssociation.user_id,
  companyId: dbAssociation.company_id,
  role: dbAssociation.role,
  isActive: dbAssociation.is_active,
  company: dbAssociation.company ? transformCompany(dbAssociation.company) : undefined,
  createdAt: dbAssociation.created_at,
  updatedAt: dbAssociation.updated_at,
});

// Transform database user session to TypeScript interface
export const transformUserSession = (dbSession: any): UserSession => ({
  id: dbSession.id,
  userId: dbSession.user_id,
  activeCompanyId: dbSession.active_company_id,
  company: dbSession.company ? transformCompany(dbSession.company) : undefined,
  createdAt: dbSession.created_at,
  updatedAt: dbSession.updated_at,
});
