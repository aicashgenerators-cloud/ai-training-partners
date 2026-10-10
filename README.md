# AI Training site (GitHub Pages + Google Sheets)

- **Website:** React site hosted free on GitHub Pages.
- **Registrations:** saved as rows in a Google Sheet by a Google Apps Script (`apps-script/Code.gs`).
- **Admin panel:** `/admin` on the site (password protected) to search, change status, assign a handler, add notes, delete, and download CSV.

No server and no paid hosting needed.

## Setup in 3 parts
1. Create a Google Sheet, paste `apps-script/Code.gs` into Extensions -> Apps Script, set the `ADMIN_PASSWORD` script property, and deploy as a Web app (Anyone). Copy the Web app URL (ends in `/exec`).
2. In the GitHub repo: Settings -> Secrets and variables -> Actions -> Variables -> add `VITE_SHEETS_URL` = that URL.
3. Settings -> Pages -> Source: **GitHub Actions**, then run the "Deploy site to GitHub Pages" workflow.

## Run locally
```bash
npm install
cp .env.example .env     # paste your Web app URL
npm run dev
```

## Notes
- After you edit `Code.gs`, redeploy: Deploy -> Manage deployments -> pencil -> Version: New version -> Deploy. The URL stays the same.
- The Web app URL is visible inside the website's code (that's normal). The Sheet itself stays private to you, and the admin actions need your password.
