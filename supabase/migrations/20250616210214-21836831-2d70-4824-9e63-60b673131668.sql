
-- Add new columns to users table for password management
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS requires_password_change boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS temporary_password text,
ADD COLUMN IF NOT EXISTS password_changed_at timestamp with time zone;

-- Update existing users to not require password change (for existing accounts)
UPDATE public.users 
SET requires_password_change = false 
WHERE requires_password_change IS NULL;

-- Create index for better performance on password change queries
CREATE INDEX IF NOT EXISTS idx_users_requires_password_change 
ON public.users(requires_password_change) 
WHERE requires_password_change = true;
