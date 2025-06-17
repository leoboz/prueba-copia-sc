
-- Remove the profiles table and its trigger to eliminate duplication
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Update the trigger function to insert into users table instead
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    name, 
    email, 
    role,
    requires_password_change,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'farmer'),
    true,
    true,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = now();
  RETURN new;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
