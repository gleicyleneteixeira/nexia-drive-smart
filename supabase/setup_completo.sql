-- ============================================================
-- SCRIPT COMPLETO - Nexia DETRAN (Novo Supabase)
-- Copie e cole no SQL Editor do Supabase
-- ============================================================

-- ===================== ENUMS =====================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.library_item_type AS ENUM ('pdf', 'heyzine', 'link');

-- ===================== TABELAS =====================

-- Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  phone TEXT,
  cpf TEXT,
  employment_status TEXT CHECK (employment_status IN ('carteira_assinada','autonomo','estudante','trabalha_estuda','desempregado','outro','nao_trabalha')),
  employment_other TEXT,
  studies BOOLEAN,
  status TEXT NOT NULL DEFAULT 'pendente_pagamento',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS profiles_cpf_unique ON public.profiles (cpf) WHERE cpf IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique ON public.profiles (LOWER(email)) WHERE email IS NOT NULL;

-- User Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Library Items
CREATE TABLE public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  item_type public.library_item_type NOT NULL,
  url TEXT NOT NULL,
  cover_url TEXT,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  price_cents INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  module_type TEXT NOT NULL DEFAULT 'teorico',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- App Ratings
CREATE TABLE public.app_ratings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contribution Clicks
CREATE TABLE public.contribution_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX contribution_clicks_user_id_idx ON public.contribution_clicks(user_id);
CREATE INDEX contribution_clicks_clicked_at_idx ON public.contribution_clicks(clicked_at DESC);

-- Pix Transactions
CREATE TABLE public.pix_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  txid TEXT NOT NULL UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ATIVA',
  pix_copia_e_cola TEXT NOT NULL,
  qrcode_base64 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===================== FUNÇÕES =====================

-- has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- handle_new_user (versão final com status)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, phone, cpf, employment_status, employment_other, status)
  VALUES (
    NEW.id,
    UPPER(COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)),
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

-- ===================== TRIGGERS =====================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER touch_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER touch_library_items BEFORE UPDATE ON public.library_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER app_ratings_touch_updated_at BEFORE UPDATE ON public.app_ratings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ===================== PERMISSÕES =====================

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT ON public.library_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_items TO authenticated;
GRANT ALL ON public.library_items TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_ratings TO authenticated;
GRANT ALL ON public.app_ratings TO service_role;

GRANT SELECT, INSERT ON public.contribution_clicks TO authenticated;
GRANT ALL ON public.contribution_clicks TO service_role;

GRANT SELECT ON public.pix_transactions TO authenticated;
GRANT ALL ON public.pix_transactions TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

-- ===================== RLS =====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pix_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User Roles
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Library Items
CREATE POLICY "Anyone reads published items" ON public.library_items
  FOR SELECT TO anon, authenticated USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert items" ON public.library_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update items" ON public.library_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete items" ON public.library_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- App Ratings
CREATE POLICY "Users read own rating or admin reads all" ON public.app_ratings
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own rating" ON public.app_ratings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own rating" ON public.app_ratings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own rating" ON public.app_ratings
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Contribution Clicks
CREATE POLICY "Users insert own contribution click" ON public.contribution_clicks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own contribution clicks or admin reads all" ON public.contribution_clicks
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Pix Transactions
CREATE POLICY "Users read own transactions" ON public.pix_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Service role full access" ON public.pix_transactions
  TO service_role USING (true) WITH CHECK (true);

-- Storage (biblioteca)
CREATE POLICY "Public read library files" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'library');
CREATE POLICY "Admins upload library files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'library' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update library files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'library' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete library files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'library' AND public.has_role(auth.uid(), 'admin'));

-- ===================== ADMIN =====================
-- Torna o e-mail gleicileneteixeira.gd@gmail.com como admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'gleicileneteixeira.gd@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- ===================== BUCKET STORAGE =====================
INSERT INTO storage.buckets (id, name, public)
VALUES ('library', 'library', true)
ON CONFLICT (id) DO NOTHING;

-- Pronto! Tudo criado.
