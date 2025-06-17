
export interface Organization {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithOrganization {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organization?: Organization;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
