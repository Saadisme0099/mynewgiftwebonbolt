-- supabase/migrations/001_create_journeys.sql

-- Enable extensions if needed (uncomment if your DB doesn't already have them)
-- create extension if not exists "pgcrypto";

CREATE TABLE IF NOT EXISTS public.journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NULL,
  recipient_name text NOT NULL,
  date_of_birth date,
  pin varchar(16) NOT NULL,
  pin_hint text,
  theme text,
  gift_type text,
  gift_style text,
  cake_flavor text,
  welcome_headline text,
  welcome_subtitle text,
  music_track text,
  music_name text,
  memories jsonb DEFAULT '[]'::jsonb,
  memory_layout text,
  game_type text,
  game_image text,
  wishes text[] DEFAULT array[]::text[],
  surprise_title text,
  surprise_message text,
  surprise_image text,
  letter_greeting text,
  letter_body text,
  letter_signoff text,
  occasion text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Optional trigger to auto-update updated_at on row update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.journeys;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.journeys
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
