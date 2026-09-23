-- Migration: Create estudo_config, cronograma_dias, and historico_ranking tables
-- Date: 2026-08-24

-- Create estudo_config table
CREATE TABLE IF NOT EXISTS estudo_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_prova DATE,
  dias_semana JSONB DEFAULT '[]'::jsonb,
  tempo_diario_minutos INTEGER DEFAULT 45,
  ritmo_leitura STRING NOT NULL DEFAULT 'normal',
  modo_intensivo BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create cronograma_dias table
CREATE TABLE IF NOT EXISTS cronograma_dias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dia_numero INTEGER NOT NULL,
  data_agendada DATE NOT NULL,
  paginas_leitura STRING NOT NULL,
  qtd_simulados_meta INTEGER DEFAULT 1,
  concluido BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Create historico_ranking table
CREATE TABLE IF NOT EXISTS historico_ranking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data DATE NOT NULL,
  pontuacao_dia INTEGER DEFAULT 0,
  simulados_aprovados_hoje INTEGER DEFAULT 0,
  simulados_gabaritados_hoje INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Add triggers for updated_at on estudo_config
CREATE OR REPLACE FUNCTION update_estudo_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_estudo_config_updated_at_trigger
BEFORE UPDATE ON estudo_config
FOR EACH ROW
EXECUTE FUNCTION update_estudo_config_updated_at();