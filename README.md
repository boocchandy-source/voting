# TCC-VOTING-SYSTEM

School Voting System for Torres Capitol College — Next.js 15 + Postgres (Drizzle) + real auth/voting, student dashboard, and admin dashboard.

## Deploy on Render

1. Push this repo to GitHub.
2. Render Dashboard → New → **Blueprint** → select the repo → Apply (`render.yaml` creates the database + web service).
3. Set `SESSION_SECRET` on the web service if not already set (Blueprint generates one).

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL + SESSION_SECRET
npm run db:push && npm run db:seed
npm run dev
```

Default accounts (after seed): admin `admin` / `admin123`, student `00005050` / `student123`.
"# voting" 
