# GiftBeat — Interactive Gift Website Builder

This repository is a Vite + React TypeScript app for creating and sharing interactive, mobile-first gift websites (birthday / celebration journeys). The project was forked from a Bolt template and extended to support a step-by-step builder, live preview, Supabase-backed persistence, and rich interactive recipient experiences.

This README covers how to set up a local dev environment, required Supabase resources, DB migration SQL, and recommended Row-Level Security (RLS) policies.

---

## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Create a `.env.local` file (for Vite) and add the following env vars:

```ini
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

- These client keys are used by the frontend to read/write via Supabase when allowed by your RLS settings. For production write operations you should prefer server-side endpoints that use the SUPABASE_SERVICE_ROLE key (see Security section).

3. Run the dev server

```bash
npm run dev
```

Visit http://localhost:5173 (or the host/port shown by Vite).

---

## Required Supabase resources

1. Storage bucket
   - Name: `journey-assets` (or change `ASSET_BUCKET` in `src/lib/supabase.ts`)
   - Recommended policy: private bucket with signed (time-limited) URLs for serving assets, or public bucket if you intentionally want public URLs.

2. Database table: `public.journeys` (SQL migration file provided in `supabase/migrations/001_create_journeys.sql`)

3. (Optional) Add an `owner_id` column (UUID) on `journeys` to associate created journeys with authenticated users.

---

## Important environment variables

- VITE_SUPABASE_URL — The Supabase project URL (client-safe)
- VITE_SUPABASE_ANON_KEY — Supabase anon key for client usage (with RLS restrictions)

For server-side operations (recommended for sensitive writes and creating signed upload URLs):
- SUPABASE_SERVICE_ROLE — Supabase service role key (DO NOT expose to clients)

Note: `src/lib/supabase.ts` now contains a small sanity check and exports `SUPABASE_CONFIGURED`. If envs are missing you will see a console error.

---

## Database migration (run in Supabase SQL editor)

A migration is included at `supabase/migrations/001_create_journeys.sql`. It creates a `journeys` table that maps to the frontend `JourneyData` TypeScript type.

File: `supabase/migrations/001_create_journeys.sql`

```sql
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
```

Run that SQL in the Supabase SQL editor to create the table and trigger.

---

## Recommended Row-Level Security (RLS) policies

There are two secure approaches. Choose one and apply policies using Supabase SQL editor.

A) Server-authorized writes (recommended)
- Keep RLS enabled on `journeys` and do NOT grant anon users insert/update/delete.
- Use a server-side endpoint (Next.js API route, serverless function or Supabase Edge Function) that uses `SUPABASE_SERVICE_ROLE` to perform inserts/updates/deletes.
- Allow public `SELECT` only for published journeys (published = true). Owner-specific reads can be allowed via `owner_id` matching `auth.uid()`.

B) Client-authorized with RLS (if you must allow client writes)
- Add `owner_id uuid` to `journeys` and require authenticated users to be the owner for update/delete.
- Use RLS policies to limit client operations.

Example RLS SQL (apply after creating table):

```sql
-- Enable RLS
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT published journeys
CREATE POLICY "public_select_published" ON public.journeys
  FOR SELECT USING (published = true);

-- Allow authenticated users to INSERT with owner_id set to auth.uid()
CREATE POLICY "insert_with_owner" ON public.journeys
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Allow owners to SELECT/UPDATE/DELETE their own rows
CREATE POLICY "owner_full_access" ON public.journeys
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- Notes:
-- If you are using server-side writes (service role), the service role bypasses RLS and can perform any operation.
-- If you keep anon client writes, tighten policies and validate client input carefully.
```

Important: The example policies rely on using Supabase Auth and storing owner_id. If your app allows anonymous/public publishing without accounts, you should instead implement server-side logic to create a short unguessable token (or use randomized UUID ids) and avoid exposing a write-capable key to the browser.

---

## Uploads & Storage

- The client code uploads assets using `src/lib/supabase.ts` to the bucket `journey-assets` and returns public URLs. The file contains client-side validation (MIME type + size limits) and a UUID fallback for filenames.
- For privacy, you may prefer to keep the bucket private and serve assets using signed URLs generated by a server (recommended). This prevents listing or public discovery of files.

---

## Security notes

- NEVER commit `SUPABASE_SERVICE_ROLE` to the repo. It should only be set as a server environment variable in your hosting provider (Vercel, Netlify, etc.).
- Client-side anon keys are fine for public read operations when RLS allows them; but for sensitive writes and deletes, use server-side endpoints that run with a service role.
- Validate and sanitize all user input (text fields, uploaded filenames, captions) before saving to the DB or rendering on the recipient page.

---

## Next recommended steps (I can implement)

1. Add README improvements and the migration/policy SQL files (this commit).
2. Implement server-side API routes (Next.js or serverless) to handle create/update/delete and signed uploads using `SUPABASE_SERVICE_ROLE` (I can implement these next).
3. Harden RLS and change client-side code to call your server API for sensitive operations.
4. Implement interactive components (scratch-card canvas, memory-match game, sliding puzzle) and wire them into the preview and published journey view.

If you want, I will now add the migration SQL and policy example to the repo (I have done that here) and then proceed to create a small Next.js API layer (or an express/fastify server) to handle safe writes and signed upload URLs. Please confirm if you want the serverless API implemented in Next.js (recommended) or prefer a different server.
