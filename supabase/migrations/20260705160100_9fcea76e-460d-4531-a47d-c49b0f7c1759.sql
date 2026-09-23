
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS studies BOOLEAN;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_other TEXT;
ALTER TABLE public.profiles ALTER COLUMN cpf DROP NOT NULL;

-- ensure unique email in profiles
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique ON public.profiles (LOWER(email)) WHERE email IS NOT NULL;

-- Allow admins to see all profiles for user management (view own already exists via OR has_role)
-- policy already includes has_role admin, so nothing else needed.
