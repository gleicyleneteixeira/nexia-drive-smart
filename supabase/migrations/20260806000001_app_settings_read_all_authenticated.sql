-- App settings are public configuration (WhatsApp links, feature toggles).
-- Every authenticated user must be able to READ them so the UI works for
-- students (trial toggle, group popup, support link). Only admins can write.
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admins write settings" ON public.app_settings;

CREATE POLICY "Anyone authenticated can read settings" ON public.app_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins write settings" ON public.app_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
