
-- Update the admin user to be a system admin so they can see all companies
UPDATE public.users 
SET is_system_admin = true 
WHERE email = 'admin@pureseed.com' AND role = 'admin';

-- Also ensure any other admin role users are system admins
UPDATE public.users 
SET is_system_admin = true 
WHERE role = 'admin';
