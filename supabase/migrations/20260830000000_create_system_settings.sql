-- Cria a tabela system_settings (configurações sensíveis, ex.: ViperConnect)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilita Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Permite leitura (SELECT) por qualquer usuário autenticado
DROP POLICY IF EXISTS "Permitir leitura de system_settings" ON public.system_settings;
CREATE POLICY "Permitir leitura de system_settings"
  ON public.system_settings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Permite escrita (ALL) apenas para usuários autenticados
DROP POLICY IF EXISTS "Permitir atualização de system_settings" ON public.system_settings;
CREATE POLICY "Permitir atualização de system_settings"
  ON public.system_settings
  FOR ALL
  USING (auth.role() = 'authenticated');
