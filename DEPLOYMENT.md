# Deployment

- **Database:** Neon (Postgres) — same Neon project used for Taskline (`neon-emerald-village`), separate database named `quiz` (to avoid table name clashes, e.g. both projects have a `categories` table)
  - Schema managed with Drizzle (`cd server && npm run db:push`)
  - Data seeded from `db.json` via `cd server && npm run migrate`
- **Backend (`server/`, Express + Drizzle):** intended for Render as a separate web service — not deployed yet as of this note
  - Env var needed: `DATABASE_URL` (the Neon `quiz` database connection string)
- **Frontend (Create React App):** intended for Vercel — not deployed yet as of this note
  - Env var needed: `REACT_APP_API_URL` = the Render backend's URL, once deployed

Update this file with the real URLs once both are actually deployed.
