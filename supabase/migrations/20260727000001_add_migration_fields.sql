-- 1. Cria colunas de controle no perfil (is_migrated, is_first_access, needs_new_password e status de acesso)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_migrated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_first_access boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS needs_new_password boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS access_status text DEFAULT 'active';

-- 2. Marca TODOS os perfis atuais com CPF como MIGRADOS, acesso LIBERADO e pendentes do Primeiro Acesso
UPDATE public.profiles 
SET is_migrated = true,
    is_first_access = true,
    access_status = 'active'
WHERE cpf IS NOT NULL AND cpf != '';

-- 3. Cria uma função RPC pública (SECURITY DEFINER) para verificar o CPF/E-mail sem esbarrar nas travas do RLS
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
  WHERE p.cpf = regexp_replace(search_input, '\D', '', 'g') -- Limpa pontuação de CPF se houver
     OR lower(p.email) = lower(search_input)
  LIMIT 1;
END;
$$;
