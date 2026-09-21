# Elite Career Launchpad · Placement Desk

Campus placement command centre for students. Dark ink + amber signal. Space Grotesk / Inter / IBM Plex Mono.

Live: https://elite-career-launchpad.vercel.app

## What is here

- Student overview with readiness, pipeline counts, week ahead
- Drives listing with search and eligibility
- Drive detail with rounds and progress
- Application pipeline (Applied → OA → Tech → HR → Offer)
- Interview calendar
- Prep desk with tracks
- Profile Lab (GitHub + LinkedIn weighted checklists)
- Supabase auth + Postgres backend (ready to activate)

## Supabase setup (do this once)

1. Open your project at https://supabase.com/dashboard (project id is already in `.env`)
2. Go to **SQL Editor** → New query
3. Paste and run the full contents of `supabase/migrations/20250921000000_init.sql`
4. Still in SQL Editor, run the drives seed from `supabase/seed.sql` (the top half — the INSERT into drives)
5. Authentication → Providers → make sure Email is enabled
6. Create a test user either via the Auth dashboard or through the `/auth` page in the app
7. After you have a real user UUID, uncomment the demo user block at the bottom of `supabase/seed.sql`, replace `YOUR_USER_UUID_HERE`, and run it

That gives you:

- profiles linked to auth.users
- public drives
- private applications, history, interviews, prep tracks, profile checks
- full RLS so students only see their own data

## Local development

```bash
bun install   # or npm i
bun run dev   # or npm run dev
```

Env is already present in `.env`. For production on Vercel, set the same `VITE_SUPABASE_*` and `SUPABASE_*` variables.

## Architecture notes

- TanStack Start + React 19 + Vite + Tailwind 4
- Supabase JS client + generated types in `src/integrations/supabase`
- Data hooks in `src/hooks/use-portal-data.ts` (session, profile, drives, applications, interviews, prep, profile checks)
- Static data in `src/data/portal.ts` still powers the UI while you wire the last pages; once seeded, the hooks take over cleanly
- Auth page at `/auth` (sign in / sign up with name, roll, branch)

## Roadmap status

See `roadmap.md`. Next high-value moves after the schema is live:

- Wire every route to the hooks (Overview, Pipeline, Calendar, Prep, Profile Lab already have the hooks ready)
- Apply button on drive detail that creates an application + history row
- Toggle profile checks with optimistic updates
- Real-time subscription on applications if you want live status changes
