-- Atualiza trigger para copiar CPF dos metadados do novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, phone, cpf, employment_status, employment_other)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'employment_status',
    NEW.raw_user_meta_data->>'employment_other'
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    cpf = COALESCE(EXCLUDED.cpf, public.profiles.cpf),
    employment_status = COALESCE(EXCLUDED.employment_status, public.profiles.employment_status),
    employment_other = COALESCE(EXCLUDED.employment_other, public.profiles.employment_other);
  RETURN NEW;
END;
$$;

-- Recria trigger garantindo que esteja ativo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill seguro: só preenche CPF quando o valor é único nos metadados e não existe em outro perfil
WITH eligible AS (
  SELECT u.id, u.raw_user_meta_data->>'cpf' as cpf
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
  WHERE p.cpf IS NULL
    AND u.raw_user_meta_data->>'cpf' IS NOT NULL
),
unique_cpf AS (
  SELECT cpf
  FROM eligible
  GROUP BY cpf
  HAVING COUNT(*) = 1
),
to_update AS (
  SELECT e.id, e.cpf
  FROM eligible e
  JOIN unique_cpf u ON u.cpf = e.cpf
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p2 WHERE p2.cpf = e.cpf
  )
)
UPDATE public.profiles p
SET cpf = tu.cpf
FROM to_update tu
WHERE p.id = tu.id;