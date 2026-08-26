/*
# Create journeys table and storage buckets (single-tenant, no auth)

1. New Tables
- `journeys` — stores a complete interactive gift journey created by a user.
  All fields correspond to the 11-step creation wizard. The UUID id doubles as
  the unguessable share link slug.

2. Security
- Enable RLS on `journeys`.
- Allow anon + authenticated CRUD — single-tenant no-auth app, journeys are
  shareable by unguessable UUID link.

3. Storage
- Create `journey-assets` public storage bucket for uploaded photos, audio,
  and game images. Allow anon CRUD on objects in this bucket.
*/

CREATE TABLE IF NOT EXISTS journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name text NOT NULL DEFAULT '',
  date_of_birth date,
  pin text DEFAULT '1234',
  pin_hint text DEFAULT '',
  theme text DEFAULT 'classic',
  gift_type text DEFAULT 'giftbox',
  gift_style text DEFAULT 'classic-pink',
  cake_flavor text DEFAULT 'classic-pink',
  welcome_headline text DEFAULT 'There''s something special I want to tell you...',
  welcome_subtitle text DEFAULT '',
  music_track text DEFAULT '',
  music_name text DEFAULT '',
  memories jsonb DEFAULT '[]'::jsonb,
  memory_layout text DEFAULT 'polaroid',
  game_type text DEFAULT 'memory',
  game_image text DEFAULT '',
  wishes jsonb DEFAULT '[]'::jsonb,
  surprise_title text DEFAULT '',
  surprise_message text DEFAULT '',
  surprise_image text DEFAULT '',
  letter_greeting text DEFAULT 'My dearest,',
  letter_body text DEFAULT '',
  letter_signoff text DEFAULT 'Forever yours, with all my heart',
  occasion text DEFAULT 'birthday',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_journeys" ON journeys;
CREATE POLICY "anon_select_journeys" ON journeys FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_journeys" ON journeys;
CREATE POLICY "anon_insert_journeys" ON journeys FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_journeys" ON journeys;
CREATE POLICY "anon_update_journeys" ON journeys FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_journeys" ON journeys;
CREATE POLICY "anon_delete_journeys" ON journeys FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('journey-assets', 'journey-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_read_assets" ON storage.objects;
CREATE POLICY "anon_read_assets" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'journey-assets');

DROP POLICY IF EXISTS "anon_insert_assets" ON storage.objects;
CREATE POLICY "anon_insert_assets" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'journey-assets');

DROP POLICY IF EXISTS "anon_update_assets" ON storage.objects;
CREATE POLICY "anon_update_assets" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'journey-assets') WITH CHECK (bucket_id = 'journey-assets');

DROP POLICY IF EXISTS "anon_delete_assets" ON storage.objects;
CREATE POLICY "anon_delete_assets" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'journey-assets');
