-- Mensagem FINAL da boas-vindas (WhatsApp): dados de acesso do aluno.
-- Problema real: muita gente contrata e já começa a perguntar "qual é meu
-- usuário e senha?". A senha é guardada em hash (impossível ler), então o
-- texto informa o usuário (e-mail de login) e orienta que a senha é a criada
-- no cadastro, com a palavra-chave "SENHA" para acionar o reset existente.
INSERT INTO public.system_settings (key, value) VALUES
  ('viperconnect_welcome_access_enabled', 'true'),
  ('viperconnect_welcome_access_message', '🔐 *Seus dados de acesso* — tire um print e guarde!
👤 Usuário / Acesso: {email}
🔒 Senha: a que você criou no cadastro
⚠️ Esqueceu? Mande aqui a palavra *SENHA* que eu gero uma nova na hora.')
ON CONFLICT (key) DO NOTHING;
