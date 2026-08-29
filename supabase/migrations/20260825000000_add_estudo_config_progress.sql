-- Migration: adiciona colunas de progresso de leitura em estudo_config
-- Data: 2026-08-25
-- Permite salvar o ponto de parada do aluno no cronograma de leitura.

ALTER TABLE estudo_config
  ADD COLUMN IF NOT EXISTS current_chapter INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_page INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_pages INTEGER NOT NULL DEFAULT 0;
