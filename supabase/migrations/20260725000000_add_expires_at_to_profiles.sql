-- Adiciona coluna expires_at na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Concede 30 dias de acesso a todos os usuarios existentes
UPDATE public.profiles
SET status = 'ativo',
    expires_at = now() + interval '30 days',
    updated_at = now();
