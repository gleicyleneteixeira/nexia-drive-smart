CREATE TABLE public.contribution_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clicked_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX contribution_clicks_user_id_idx ON public.contribution_clicks(user_id);
CREATE INDEX contribution_clicks_clicked_at_idx ON public.contribution_clicks(clicked_at DESC);

GRANT SELECT, INSERT ON public.contribution_clicks TO authenticated;
GRANT ALL ON public.contribution_clicks TO service_role;

ALTER TABLE public.contribution_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own contribution click"
  ON public.contribution_clicks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own contribution clicks or admin reads all"
  ON public.contribution_clicks FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));