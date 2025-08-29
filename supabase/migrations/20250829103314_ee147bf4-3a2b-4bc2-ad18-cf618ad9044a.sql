-- Fix infinite recursion in profiles RLS policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Recreate admin policy using the function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin() OR auth.uid() = user_id);

-- Create admin user for demo (password: admin123)
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@ndiongue.shop',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"first_name": "Admin", "last_name": "NdiongueShop"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (
  user_id,
  first_name,
  last_name,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Admin',
  'NdiongueShop', 
  'admin'
) ON CONFLICT (user_id) DO UPDATE SET role = 'admin';