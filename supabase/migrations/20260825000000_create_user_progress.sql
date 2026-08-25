-- Migration: Create user_progress table (daily check-in / sequential reading progress)
-- Date: 2026-08-25

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_session_index INTEGER NOT NULL DEFAULT 1,
  last_access_date DATE,
  completed_pages INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_user_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_progress_updated_at_trigger
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_user_progress_updated_at();

-- Row Level Security: o próprio usuário gerencia seu progresso
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_progress_select_self" ON user_progress;
CREATE POLICY "user_progress_select_self" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_progress_upsert_self" ON user_progress;
CREATE POLICY "user_progress_upsert_self" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_progress_update_self" ON user_progress;
CREATE POLICY "user_progress_update_self" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);
