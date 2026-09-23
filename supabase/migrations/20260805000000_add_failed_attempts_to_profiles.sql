-- Migration: add failed_attempts to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS failed_attempts integer DEFAULT 0;
