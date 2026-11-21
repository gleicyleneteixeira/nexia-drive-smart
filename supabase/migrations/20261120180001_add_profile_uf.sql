ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS uf TEXT;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_uf_valid
  CHECK (
    uf IS NULL OR uf IN (
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
      'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
      'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    )
  );
