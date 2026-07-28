-- Fix handle_new_user: fail with clear message on duplicate CPF
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, phone, cpf, employment_status, employment_other, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'employment_status',
    NEW.raw_user_meta_data->>'employment_other',
    COALESCE(NEW.raw_user_meta_data->>'status', 'pendente_pagamento')
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    cpf = COALESCE(EXCLUDED.cpf, public.profiles.cpf),
    employment_status = COALESCE(EXCLUDED.employment_status, public.profiles.employment_status),
    employment_other = COALESCE(EXCLUDED.employment_other, public.profiles.employment_other),
    status = COALESCE(EXCLUDED.status, public.profiles.status);
  RETURN NEW;
EXCEPTION WHEN unique_violation THEN
  IF SQLERRM LIKE '%profiles_cpf_unique%' THEN
    RAISE EXCEPTION 'CPF já está cadastrado em outra conta. Utilize outro CPF ou faça login com a conta existente.';
  ELSE
    RAISE;
  END IF;
END;
$$;
