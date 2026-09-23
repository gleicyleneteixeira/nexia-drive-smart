-- Add 'carousel' to the library_item_type enum
ALTER TYPE public.library_item_type ADD VALUE IF NOT EXISTS 'carousel' AFTER 'image';

-- Add slides and narrated columns to library_items table
ALTER TABLE public.library_items ADD COLUMN IF NOT EXISTS slides jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.library_items ADD COLUMN IF NOT EXISTS narrated boolean NOT NULL DEFAULT false;
