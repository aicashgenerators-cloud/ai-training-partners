# TaskPilot AI

React site hosted on **GitHub Pages**, with registrations saved to an **Excel file** (`registrations.xlsx`) by a small Node API, and an **admin panel** at `/admin`.

```
Visitor ──► GitHub Pages (static site)
                │  form submit / admin calls
                ▼
          Node API (Hono + tRPC)  ──►  data/registrations.xlsx
                ▲
        /admin (password) ── view, search, change status, notes, delete, download Excel
```

GitHub Pages can only serve static files, so it can't run code or write an Excel file. The API therefore runs on a separate host and the site calls it.

## 1. Run locally

```bash
npm install
cp .env.example .env      # set ADMIN_PASSWORD and ADMIN_TOKEN_SECRET
npm run dev               # site + API on http://localhost:3000
```

Submit the form at `/register`, then open `/admin`. The file appears at `data/registrations.xlsx`.

## 2. Deploy the API (needs persistent storage)

The Excel file lives on the API server's disk, so use a host with a **persistent volume**. A free tier with an ephemeral disk will lose registrations on every restart.

- **Render**: New → Blueprint → pick this repo (uses `render.yaml`). Set `ADMIN_PASSWORD` and `ALLOWED_ORIGINS`.
- **Fly.io / Railway / VPS**: build the `Dockerfile`, mount a volume at `/data`, and set the env vars from `.env.example`.

Environment variables:

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | Your admin login password |
| `ADMIN_TOKEN_SECRET` | Long random string (`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`) |
| `DATA_DIR` | `/data` (the persistent volume) |
| `ALLOWED_ORIGINS` | Your site origin, e.g. `https://YOURNAME.github.io` (origin only, no path) |

Check it works: open `https://YOUR-API-HOST/api/health`.

## 3. Deploy the site to GitHub Pages

1. Push this folder to a GitHub repo (branch `main`).
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Repo **Settings → Secrets and variables → Actions → Variables**: add `VITE_API_URL` = your API URL (no trailing slash). Optional: `CUSTOM_DOMAIN` if you use one.
4. Push (or run the workflow manually). The site goes live at `https://YOURNAME.github.io/REPO/`.

Then set `ALLOWED_ORIGINS` on the API to `https://YOURNAME.github.io`.

## Admin panel

Go to `/admin` and sign in. You can search and filter, change status, assign a handler, add notes, delete, and **Download Excel**. You can also open `registrations.xlsx` directly and edit it; the server picks up outside edits automatically (don't edit it while someone is submitting).

## Security notes

- **Never commit `data/` or `.xlsx` files.** They hold personal data and are in `.gitignore`.
- Admin sessions use a signed token that lasts 12 hours. Login is limited to 5 failed attempts per IP per 15 minutes, and form submissions to 10 per IP per hour.
- Keep a backup. Download the Excel regularly, or back up the volume.
- This is single-instance by design (one file). Don't run multiple API replicas.
