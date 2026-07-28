-- 1. Add status column to profiles with default value 'pendente_pagamento'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pendente_pagamento';

-- 2. Backfill: Update all existing profiles to 'ativo'
UPDATE public.profiles SET status = 'ativo' WHERE status IS NULL OR status = 'pendente_pagamento';

-- 3. Update the handle_new_user trigger function to also insert/update status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, phone, cpf, employment_status, employment_other, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'employment_status',
    NEW.raw_user_meta_data->>'employment_other',
    COALESCE(NEW.raw_user_meta_data->>'status', 'pendente_pagamento')
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    cpf = COALESCE(EXCLUDED.cpf, public.profiles.cpf),
    employment_status = COALESCE(EXCLUDED.employment_status, public.profiles.employment_status),
    employment_other = COALESCE(EXCLUDED.employment_other, public.profiles.employment_other),
    status = COALESCE(EXCLUDED.status, public.profiles.status);
  RETURN NEW;
END;
$$;

-- 4. Create pix_transactions table
CREATE TABLE IF NOT EXISTS public.pix_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  txid text NOT NULL UNIQUE,
  amount numeric(10, 2) NOT NULL,
  plan_type text NOT NULL, -- '1_month' | '3_months' | '6_months'
  status text NOT NULL DEFAULT 'ATIVA', -- 'ATIVA', 'CONCLUIDA', etc.
  pix_copia_e_cola text NOT NULL,
  qrcode_base64 text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS for transactions
ALTER TABLE public.pix_transactions ENABLE ROW LEVEL SECURITY;

-- Select policies
DROP POLICY IF EXISTS "Users read own transactions" ON public.pix_transactions;
CREATE POLICY "Users read own transactions"
  ON public.pix_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Service role full access" ON public.pix_transactions;
CREATE POLICY "Service role full access"
  ON public.pix_transactions TO service_role
  USING (true) WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.pix_transactions TO authenticated;
GRANT ALL ON public.pix_transactions TO service_role;

-- 5. Add module_type column to library_items with default value 'teorico'
ALTER TABLE public.library_items ADD COLUMN IF NOT EXISTS module_type text NOT NULL DEFAULT 'teorico';
