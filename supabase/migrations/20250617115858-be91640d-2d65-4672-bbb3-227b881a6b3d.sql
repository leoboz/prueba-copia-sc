
-- Phase 1: Database Foundation

-- Create companies table
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('geneticsCompany', 'multiplier', 'lab', 'farmer')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_company_associations table (many-to-many relationship)
CREATE TABLE public.user_company_associations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('geneticsCompany', 'multiplier', 'lab', 'farmer')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Create user_sessions table to track active company context
CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  active_company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add company_id to existing data tables
ALTER TABLE public.lots ADD COLUMN company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.samples ADD COLUMN company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.varieties ADD COLUMN company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.plants ADD COLUMN company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.tests ADD COLUMN company_id uuid REFERENCES public.companies(id);

-- Add is_system_admin to users table (separate from company roles)
ALTER TABLE public.users ADD COLUMN is_system_admin boolean NOT NULL DEFAULT false;

-- Create security definer functions for company access control
CREATE OR REPLACE FUNCTION public.get_current_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT active_company_id 
  FROM public.user_sessions 
  WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.user_has_company_access(company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_company_associations 
    WHERE user_id = auth.uid() 
    AND company_id = $1 
    AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_system_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(is_system_admin, false) 
  FROM public.users 
  WHERE id = auth.uid();
$$;

-- Enable RLS on new tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_company_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view companies they are associated with" 
  ON public.companies 
  FOR SELECT 
  USING (
    public.is_system_admin() OR 
    public.user_has_company_access(id)
  );

CREATE POLICY "System admins can manage companies" 
  ON public.companies 
  FOR ALL 
  USING (public.is_system_admin());

-- RLS Policies for user_company_associations
CREATE POLICY "Users can view their own associations" 
  ON public.user_company_associations 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    public.is_system_admin()
  );

CREATE POLICY "System admins can manage associations" 
  ON public.user_company_associations 
  FOR ALL 
  USING (public.is_system_admin());

-- RLS Policies for user_sessions
CREATE POLICY "Users can manage their own sessions" 
  ON public.user_sessions 
  FOR ALL 
  USING (user_id = auth.uid());

-- Update RLS policies for data tables to include company isolation
-- Lots
DROP POLICY IF EXISTS "Users can view lots" ON public.lots;
CREATE POLICY "Users can view company lots" 
  ON public.lots 
  FOR SELECT 
  USING (
    public.is_system_admin() OR 
    (company_id = public.get_current_user_company_id() AND public.user_has_company_access(company_id))
  );

-- Samples  
DROP POLICY IF EXISTS "Users can view samples" ON public.samples;
CREATE POLICY "Users can view company samples" 
  ON public.samples 
  FOR SELECT 
  USING (
    public.is_system_admin() OR 
    (company_id = public.get_current_user_company_id() AND public.user_has_company_access(company_id))
  );

-- Varieties
DROP POLICY IF EXISTS "Users can view varieties" ON public.varieties;
CREATE POLICY "Users can view company varieties" 
  ON public.varieties 
  FOR SELECT 
  USING (
    public.is_system_admin() OR 
    (company_id = public.get_current_user_company_id() AND public.user_has_company_access(company_id))
  );

-- Plants
DROP POLICY IF EXISTS "Users can view plants" ON public.plants;
CREATE POLICY "Users can view company plants" 
  ON public.plants 
  FOR SELECT 
  USING (
    public.is_system_admin() OR 
    (company_id = public.get_current_user_company_id() AND public.user_has_company_access(company_id))
  );

-- Tests
DROP POLICY IF EXISTS "Users can view tests" ON public.tests;
CREATE POLICY "Users can view company tests" 
  ON public.tests 
  FOR SELECT 
  USING (
    public.is_system_admin() OR 
    (company_id = public.get_current_user_company_id() AND public.user_has_company_access(company_id))
  );

-- Create default companies based on existing user roles and migrate data
INSERT INTO public.companies (name, code, role, is_active) VALUES
  ('Empresa Genética Principal', 'GEN001', 'geneticsCompany', true),
  ('Multiplicador Principal', 'MUL001', 'multiplier', true),
  ('Laboratorio Principal', 'LAB001', 'lab', true),
  ('Productor Principal', 'FAR001', 'farmer', true);

-- Migrate existing users to company associations
WITH company_mapping AS (
  SELECT 
    'geneticsCompany' as user_role,
    (SELECT id FROM public.companies WHERE role = 'geneticsCompany' LIMIT 1) as company_id
  UNION ALL
  SELECT 
    'multiplier' as user_role,
    (SELECT id FROM public.companies WHERE role = 'multiplier' LIMIT 1) as company_id
  UNION ALL
  SELECT 
    'lab' as user_role,
    (SELECT id FROM public.companies WHERE role = 'lab' LIMIT 1) as company_id
  UNION ALL
  SELECT 
    'farmer' as user_role,
    (SELECT id FROM public.companies WHERE role = 'farmer' LIMIT 1) as company_id
)
INSERT INTO public.user_company_associations (user_id, company_id, role, is_active)
SELECT 
  u.id,
  cm.company_id,
  u.role,
  u.is_active
FROM public.users u
JOIN company_mapping cm ON u.role = cm.user_role
WHERE cm.company_id IS NOT NULL;

-- Create user sessions for existing users
INSERT INTO public.user_sessions (user_id, active_company_id)
SELECT 
  uca.user_id,
  uca.company_id
FROM public.user_company_associations uca
WHERE uca.is_active = true
ON CONFLICT (user_id) DO NOTHING;

-- Update existing data to associate with appropriate companies
UPDATE public.lots 
SET company_id = (
  SELECT uca.company_id 
  FROM public.user_company_associations uca 
  WHERE uca.user_id = lots.user_id 
  LIMIT 1
)
WHERE company_id IS NULL;

UPDATE public.samples 
SET company_id = (
  SELECT uca.company_id 
  FROM public.user_company_associations uca 
  WHERE uca.user_id = samples.user_id 
  LIMIT 1
)
WHERE company_id IS NULL;

UPDATE public.varieties 
SET company_id = (
  SELECT uca.company_id 
  FROM public.user_company_associations uca 
  WHERE uca.user_id = varieties.created_by 
  LIMIT 1
)
WHERE company_id IS NULL AND created_by IS NOT NULL;

UPDATE public.plants 
SET company_id = (
  SELECT uca.company_id 
  FROM public.user_company_associations uca 
  WHERE uca.user_id = plants.multiplier_id 
  LIMIT 1
)
WHERE company_id IS NULL;

UPDATE public.tests 
SET company_id = (
  SELECT uca.company_id 
  FROM public.user_company_associations uca 
  WHERE uca.user_id = tests.created_by 
  LIMIT 1
)
WHERE company_id IS NULL AND created_by IS NOT NULL;
