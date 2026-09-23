-- Configurações do Webhook Global de Eventos do Sistema
-- Adiciona a URL e o flag de ativação na tabela system_settings.
INSERT INTO public.system_settings (key, value) VALUES
  ('global_webhook_url', ''),
  ('global_webhook_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- A leitura das configurações do webhook é feita no cliente (fire & forget) para
-- usuários não logados (solicitação de reset de senha) e logados (cadastro),
-- por isso liberamos o SELECT somente das duas chaves do webhook para anon/authenticated.
-- As demais chaves de system_settings continuam restritas a admins (policy existente).
DROP POLICY IF EXISTS "Public read webhook settings" ON public.system_settings;
CREATE POLICY "Public read webhook settings" ON public.system_settings
  FOR SELECT TO anon, authenticated
  USING (key IN ('global_webhook_url', 'global_webhook_enabled'));
