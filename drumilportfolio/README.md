# TINMCO Website — Monorepo

Deployed on Vercel at **[tinmco.com](https://tinmco.com)**. The Vercel project root is set to `/drumilportfolio`.

---

## Project Structure

```
drumilportfolio/
├── portfolio.html          # Main landing/portfolio page (served at /)
├── styles.css              # Styles for portfolio.html
├── script.js               # JS for portfolio.html (demo iframe switcher)
├── index.html              # Redirect shim → /portfolio.html
├── 404.html                # Custom 404 page
├── vercel.json             # All routing rules (redirects + rewrites)
├── robots.txt / sitemap.xml
│
├── archshield-app/         # Archshield project
│   ├── frontend/           # Next.js app (output: frontend/out/)
│   └── backend/            # FastAPI Python backend
│
├── business/               # Business Analytics project
│   ├── (Next.js app, output: business/out/)
│   └── backend/            # NestJS backend (deployed on Render)
│
├── olympiad/               # Indian National Olympiad project
│   └── (Next.js app, output: olympiad/out/)
│
├── procurement/            # Procurement AI project (static HTML)
│
├── demo-websites/          # Static CA/GlobalTrade demo sites
│   ├── ca-webcodex/        → tinmco.com/demo-websites/ca-webcodex
│   ├── ca-website/         → tinmco.com/demo-websites/ca-website
│   └── import-export/      → tinmco.com/demo-websites/import-export
│
├── render.yaml             # Render.com config for business backend
├── launch.bat              # Run local dev server (Windows)
└── server.js               # Local dev server (mirrors Vercel routing)
```

---

## URL Routing

| URL | Serves |
|-----|--------|
| `/` | `portfolio.html` |
| `/portfolio` | `portfolio.html` |
| `/archshield` | `archshield-app/frontend/out/` |
| `/business` | `business/out/` |
| `/olympiad` | `olympiad/out/` |
| `/procurement` | `procurement/index.html` |
| `/demo-websites/ca-webcodex` | `demo-websites/ca-webcodex/` |
| `/demo-websites/ca-website` | `demo-websites/ca-website/` |
| `/demo-websites/import-export` | `demo-websites/import-export/` |
| `/dashboard`, `/login`, `/signup` | Archshield frontend |

All rules are defined in `vercel.json`.

---

## Local Development

```bash
node server.js
# Open: http://localhost:8080
```

Or double-click `launch.bat` on Windows.

---

## Build & Deploy

Vercel auto-deploys on push to `main`. Build the Next.js apps manually before pushing:

```bash
# Archshield
cd archshield-app/frontend && npm run build

# Business Analytics
cd business && npm run build

# Olympiad
cd olympiad && npm run build
```

> The `out/` directories are whitelisted in `.gitignore` so they get committed and served as static files by Vercel.

### Business Backend (Render)
The NestJS backend for Business Analytics is deployed separately on Render via `render.yaml`.

---

## Adding a New Project

1. Create a folder in `drumilportfolio/` (e.g. `myproject/`)
2. Add a rewrite in `vercel.json`:
   ```json
   { "source": "/myproject", "destination": "/myproject/index.html" },
   { "source": "/myproject/:path*", "destination": "/myproject/:path*" }
   ```
3. Add the corresponding route in `server.js` for local dev.
4. Commit and push — Vercel deploys automatically.
