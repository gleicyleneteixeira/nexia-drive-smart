-- Regra nova do convite do grupo de WhatsApp (profiles):
-- "Já sou membro" (joined)      -> nunca mais exibe
-- "Lembrar mais tarde" (later)  -> exibe de novo no próximo acesso
-- "Não quero participar"        -> relembra após 3 dias, no máximo 3 vezes, depois nunca mais
-- whatsapp_invite_declines conta quantas vezes a pessoa recusou;
-- whatsapp_invite_later_at guarda o momento da última recusa ("later" ou "dismissed"),
-- usado para o intervalo de 3 dias entre as novas tentativas.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp_invite_declines INTEGER NOT NULL DEFAULT 0;

-- Quem já tinha recusado na regra antiga (recusa permanente) continua sem convite.
UPDATE public.profiles
SET whatsapp_invite_declines = 3
WHERE whatsapp_invite_status = 'dismissed';
