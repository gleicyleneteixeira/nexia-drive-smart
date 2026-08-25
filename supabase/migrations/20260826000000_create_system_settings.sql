-- Tabela de configurações globais do sistema (uso administrativo / integrações)
-- Diferente de `app_settings` (que é público para alunos), aqui ficam
-- credenciais sensíveis (tokens de API) e só admins podem ler/escrever.
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Apenas o service_role (backend / server functions) tem acesso total
GRANT ALL ON public.system_settings TO service_role;
-- Authenticated precisa de SELECT/INSERT/UPDATE/DELETE, mas a policy restringe a admins
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;

-- Só admins leem/escrevem
CREATE POLICY "Admins read system_settings" ON public.system_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write system_settings" ON public.system_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Inserção inicial das chaves da ViperConnect / Uno API
INSERT INTO public.system_settings (key, value) VALUES
  ('viperconnect_api_url', 'https://sua-instancia-viperconnect.com'),
  ('viperconnect_token', ''),
  ('viperconnect_instance_id', ''),
  ('viperconnect_welcome_enabled', 'true'),
  ('viperconnect_welcome_message', 'Olá {nome}! Seja muito bem-vindo(a) ao Nexia Drive. Seu acesso já está liberado! 🚀'),
  ('viperconnect_welcome_media_url', '')
ON CONFLICT (key) DO NOTHING;
