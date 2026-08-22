-- Corrige a flag needs_new_password para novos cadastros.
-- 1. Altera o DEFAULT da coluna de TRUE para FALSE (novos usuários nascem com senha válida)
ALTER TABLE public.profiles
ALTER COLUMN needs_new_password SET DEFAULT FALSE;

-- 2. Corrige registros órfãos onde o valor ficou NULL (nunca deveria acontecer)
UPDATE public.profiles
SET needs_new_password = FALSE
WHERE needs_new_password IS NULL;

-- 3. Re-cria o trigger handle_new_user incluindo needs_new_password = FALSE
--    Preserva toda a lógica existente (UPPER, employment, ON CONFLICT, exception).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, display_name, email, phone, cpf,
    employment_status, employment_other, status,
    needs_new_password
  )
  VALUES (
    NEW.id,
    UPPER(COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'employment_status',
    NEW.raw_user_meta_data->>'employment_other',
    COALESCE(NEW.raw_user_meta_data->>'status', 'pendente_pagamento'),
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(UPPER(EXCLUDED.display_name), public.profiles.display_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    cpf = COALESCE(EXCLUDED.cpf, public.profiles.cpf),
    employment_status = COALESCE(EXCLUDED.employment_status, public.profiles.employment_status),
    employment_other = COALESCE(EXCLUDED.employment_other, public.profiles.employment_other),
    status = COALESCE(EXCLUDED.status, public.profiles.status),
    needs_new_password = COALESCE(public.profiles.needs_new_password, FALSE);
  RETURN NEW;
EXCEPTION WHEN unique_violation THEN
  IF SQLERRM LIKE '%profiles_cpf_unique%' THEN
    RAISE EXCEPTION 'CPF já está cadastrado em outra conta. Utilize outro CPF ou faça login com a conta existente.';
  ELSE
    RAISE;
  END IF;
END;
$$;
