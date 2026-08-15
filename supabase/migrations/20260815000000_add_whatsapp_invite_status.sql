-- Adiciona colunas de controle do convite do grupo de WhatsApp na tabela profiles.
-- whatsapp_invite_status: 'pending'   -> ainda não respondeu (pode ser exibido)
--                         'joined'    -> clicou em "Entrar no Grupo"
--                         'dismissed' -> clicou em "Não quero participar" (recusa permanente)
--                         'later'     -> clicou em "Lembrar mais tarde"
-- whatsapp_invite_later_at: momento em que o usuário escolheu "Lembrar mais tarde",
--                           usado para o modal reaparecer apenas após o intervalo de cooldown.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp_invite_status VARCHAR(20) DEFAULT 'pending';

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp_invite_later_at TIMESTAMPTZ;
