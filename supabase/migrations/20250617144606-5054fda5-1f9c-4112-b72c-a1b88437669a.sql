
-- Update RLS policies for companies table to allow system admins to view all companies
DROP POLICY IF EXISTS "Users can view companies they are associated with" ON public.companies;
DROP POLICY IF EXISTS "System admins can manage companies" ON public.companies;

-- Create new policies that allow system admins to view all companies
CREATE POLICY "System admins can view all companies" 
  ON public.companies 
  FOR SELECT 
  USING (public.is_system_admin());

CREATE POLICY "Users can view companies they are associated with" 
  ON public.companies 
  FOR SELECT 
  USING (
    NOT public.is_system_admin() AND 
    public.user_has_company_access(id)
  );

CREATE POLICY "System admins can manage companies" 
  ON public.companies 
  FOR ALL 
  USING (public.is_system_admin());
