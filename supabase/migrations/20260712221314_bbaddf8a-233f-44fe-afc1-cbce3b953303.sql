
CREATE TABLE public.app_ratings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_ratings TO authenticated;
GRANT ALL ON public.app_ratings TO service_role;

ALTER TABLE public.app_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own rating or admin reads all"
ON public.app_ratings FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own rating"
ON public.app_ratings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own rating"
ON public.app_ratings FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own rating"
ON public.app_ratings FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER app_ratings_touch_updated_at
BEFORE UPDATE ON public.app_ratings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
