CREATE INDEX IF NOT EXISTS historico_ranking_user_id_idx
  ON public.historico_ranking (user_id);

CREATE OR REPLACE FUNCTION public.get_user_points_ranking()
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  total_points BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT
    history.user_id,
    COALESCE(NULLIF(BTRIM(profile.display_name), ''), 'Aluno') AS display_name,
    SUM(COALESCE(history.pontuacao_dia, 0))::BIGINT AS total_points
  FROM public.historico_ranking AS history
  INNER JOIN public.profiles AS profile ON profile.id = history.user_id
  WHERE auth.uid() IS NOT NULL
    AND profile.status = 'ativo'
  GROUP BY history.user_id, profile.display_name
  HAVING SUM(COALESCE(history.pontuacao_dia, 0)) > 0
  ORDER BY SUM(COALESCE(history.pontuacao_dia, 0)) DESC, history.user_id
  LIMIT 5;
$$;

REVOKE ALL ON FUNCTION public.get_user_points_ranking() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_points_ranking() TO authenticated;
