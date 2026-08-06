-- Teste grátis: controle global (app_settings) e individual (profiles.free_trial_enabled)
INSERT INTO public.app_settings (key, value) VALUES
  ('free_trial_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- Coluna individual: NULL = segue a config global, true = liberado, false = negado
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS free_trial_enabled BOOLEAN DEFAULT NULL;
