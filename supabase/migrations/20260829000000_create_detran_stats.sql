-- Índices de reprovação do DETRAN por estado (gestão via Super Admin)
CREATE TABLE IF NOT EXISTS public.detran_stats (
  uf VARCHAR(2) PRIMARY KEY,
  nome TEXT NOT NULL,
  teorica NUMERIC NOT NULL DEFAULT 0,
  pratica NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.detran_stats ENABLE ROW LEVEL SECURITY;

-- Leitura pública (alunos e site) — dados de reprovação são públicos
DROP POLICY IF EXISTS "Detran stats leitura pública" ON public.detran_stats;
CREATE POLICY "Detran stats leitura pública" ON public.detran_stats
  FOR SELECT TO anon, authenticated USING (true);

-- Apenas admins escrevem (via Super Admin)
DROP POLICY IF EXISTS "Detran stats escrita admin" ON public.detran_stats;
CREATE POLICY "Detran stats escrita admin" ON public.detran_stats
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed dos 27 estados (valores de referência)
INSERT INTO public.detran_stats (uf, nome, teorica, pratica) VALUES
  ('MG','Minas Gerais',48.0,60.0),
  ('RJ','Rio de Janeiro',42.5,46.7),
  ('SP','São Paulo',38.0,42.0),
  ('MT','Mato Grosso',35.0,39.7),
  ('PR','Paraná',36.0,38.5),
  ('RS','Rio Grande do Sul',34.0,37.0),
  ('BA','Bahia',40.0,36.5),
  ('PE','Pernambuco',37.0,35.0),
  ('CE','Ceará',35.5,34.0),
  ('GO','Goiás',33.0,32.5),
  ('SC','Santa Catarina',31.0,31.0),
  ('ES','Espírito Santo',30.0,29.5),
  ('DF','Distrito Federal',32.0,28.0),
  ('MA','Maranhão',33.0,27.0),
  ('PB','Paraíba',29.0,26.0),
  ('PA','Pará',31.0,25.0),
  ('MS','Mato Grosso do Sul',28.0,24.0),
  ('RN','Rio Grande do Norte',27.0,23.0),
  ('AL','Alagoas',29.0,22.0),
  ('PI','Piauí',26.0,20.0),
  ('TO','Tocantins',25.0,20.0),
  ('SE','Sergipe',26.0,19.0),
  ('RO','Rondônia',24.0,18.0),
  ('AM','Amazonas',25.0,17.0),
  ('AC','Acre',22.0,15.0),
  ('AP','Amapá',20.0,12.0),
  ('RR','Roraima',18.0,10.0)
ON CONFLICT (uf) DO NOTHING;
