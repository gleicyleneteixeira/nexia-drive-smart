
-- Expand employment_status CHECK constraint to accept all form values
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_employment_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_employment_status_check
  CHECK (employment_status IN (
    'carteira_assinada','autonomo','estudante','trabalha_estuda','desempregado','outro','nao_trabalha'
  ));
