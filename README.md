# JanConnect – Civic Platform for Citizens

A modern, transparent, and interactive way for citizens to report issues, track progress, and see real-time problem resolution — while engaging with the community.

Developer: Kashish Aggarwal

## Getting started

1. Install dependencies
```bash
npm install
```

2. Run in development
```bash
npm run dev
```

3. Build for production
```bash
npm run build
```

4. Preview production build
```bash
npm run preview
```

## Tech stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Express + Mongoose (MongoDB)

## Environment
- Set these in `janconnect-citizen-hub/.env`:
```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Optional for dev API
MONGODB_URI=mongodb://localhost:27017/janconnect

# SMTP (for email routing)
EMAIL_USERNAME=your@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
ADMIN_EMAIL=your@gmail.com
```

## Deploy (Vercel + Supabase)

1) Supabase
- SQL → run all migrations in `supabase/migrations/*`
- Auth → URL Configuration
  - Site URL: `http://localhost:8080`
  - Additional Redirect URLs: `http://localhost:8080/auth/callback`
- Auth → Providers → Google: enable + credentials + redirect to `/auth/callback`

2) Vercel
- Root: `janconnect-citizen-hub`
- Build: `npm run build` → Output: `dist`
- Include `vercel.json`
- Env on Vercel:
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
  - `EMAIL_FROM`, `EMAIL_REPLY_TO`, `APP_BASE_URL`

## Project structure

```
janconnect-citizen-hub/
  public/                # static assets (favicon, media)
  src/
    pages/               # e.g., thread.html (static page variant)
    styles/              # thread.css
    scripts/             # thread.js
    components/          # React components used in app
  routes/                # Express API routes for dev/local
  services/              # Email routing, department mapping
  supabase/              # SQL migrations
```

## Common issues
- Blank screen → Ensure `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Google login 400 → Enable Google provider in Supabase and set redirect to `/auth/callback`.
- API 404/500 in dev → Run `node server.js`; Vite proxies `/api` to `localhost:5000`.


3) Optional Express API in dev
```
node server.js
```
