-- App Settings table for admin configurations
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

-- Admins can read/write settings
CREATE POLICY "Admins read settings" ON public.app_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write settings" ON public.app_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add group_status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS group_status TEXT;

-- Default settings
INSERT INTO public.app_settings (key, value) VALUES
  ('whatsapp_group_link', 'https://chat.whatsapp.com/DPvDUOukxO4KkR42t41RAp?s=cl&p=i&mlu=4'),
  ('whatsapp_support_link', 'https://wa.link/6sc2qc'),
  ('show_group_popup', 'true'),
  ('show_whatsapp_button', 'true')
ON CONFLICT (key) DO NOTHING;
