-- ============================================
-- 1. CRIAR COLUNAS (se não existirem)
-- ============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_migrated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_first_access boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS needs_new_password boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS access_status text DEFAULT 'active';

-- ============================================
-- 2. MARCAR OS 607 USERS SEM AUTH
--    is_migrated = true
--    needs_new_password = true
--    status = 'inactive' (já executado, mas reforça)
-- ============================================
UPDATE public.profiles 
SET
  is_migrated = true,
  is_first_access = true,
  needs_new_password = true,
  access_status = 'inactive',
  status = 'inactive'
WHERE id NOT IN (
  SELECT id FROM auth.users
);

-- ============================================
-- 3. FUNÇÃO RPC: check_legacy_access
-- ============================================
CREATE OR REPLACE FUNCTION check_legacy_access(search_input text)
RETURNS TABLE (
  found boolean,
  is_migrated_user boolean,
  needs_first_access boolean,
  user_email text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true AS found,
    p.is_migrated AS is_migrated_user,
    p.is_first_access AS needs_first_access,
    p.email AS user_email
  FROM public.profiles p
  WHERE p.cpf = regexp_replace(search_input, '\D', '', 'g')
     OR lower(p.email) = lower(search_input)
  LIMIT 1;
END;
$$;

-- ============================================
-- 4. VERIFICAR RESULTADO
-- ============================================
SELECT 
  COUNT(*) FILTER (WHERE is_migrated = true) AS total_migrated,
  COUNT(*) FILTER (WHERE needs_new_password = true) AS total_sem_senha,
  COUNT(*) FILTER (WHERE status = 'inactive') AS total_inactive
FROM public.profiles;
