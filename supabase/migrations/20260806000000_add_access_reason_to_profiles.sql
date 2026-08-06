-- Adiciona coluna access_reason na tabela profiles para registrar o motivo da liberação
-- Valores esperados: 'pago', 'interno', 'campanha', 'sorteio' ou NULL
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS access_reason TEXT;
