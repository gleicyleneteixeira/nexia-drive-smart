-- Add 'video' to the library_item_type enum
ALTER TYPE public.library_item_type ADD VALUE IF NOT EXISTS 'video' AFTER 'link';
