# Archshield Business Analytics — Deployment Guide

## Architecture Overview

```
Frontend (Next.js)  →  Vercel
Backend (NestJS)    →  Railway / Render
Database (PostgreSQL) → Railway / Supabase / Neon
```

---

## 1. Deploy the Backend (Railway)

### Step 1: Push backend to GitHub
```bash
cd backend
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/YOUR_USER/archshield-backend.git
git push -u origin main
```

### Step 2: Create a Railway project
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your backend repo
3. Add a **PostgreSQL** plugin from the Railway dashboard

### Step 3: Set Environment Variables in Railway
```
DATABASE_URL=<auto-filled by Railway PostgreSQL plugin>
JWT_SECRET=<generate a long random string>
FRONTEND_URL=https://your-frontend.vercel.app
PORT=3001
```

### Step 4: Run Prisma migrations
In Railway's shell or locally with the production DATABASE_URL:
```bash
npx prisma migrate deploy
```

---

## 2. Deploy the Frontend (Vercel)

### Step 1: Push frontend to GitHub
```bash
# From the Business/ root directory
git init
git add .
git commit -m "Initial frontend"
git remote add origin https://github.com/YOUR_USER/archshield-frontend.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select your frontend repo
3. Framework: **Next.js** (auto-detected)

### Step 3: Set Environment Variables in Vercel
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Step 4: Deploy!
Vercel will auto-deploy on every push to `main`.

---

## 3. Custom Domain Setup

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain (e.g., `analytics.yourdomain.com`)
3. Add the CNAME record in your DNS provider:
   - `CNAME analytics → cname.vercel-dns.com`

### Railway (Backend)
1. Go to your service → Settings → Networking → Custom Domain
2. Add your API domain (e.g., `api.yourdomain.com`)
3. Add the CNAME record in your DNS provider

### Update CORS after domain setup
Update `FRONTEND_URL` in Railway env vars to your actual domain:
```
FRONTEND_URL=https://analytics.yourdomain.com
```

---

## 4. Guest Access

The app supports **Guest Mode** — visitors can explore the full dashboard without creating an account. The login page has a "Continue as Guest" button that bypasses authentication.

---

## 5. Local Development

```bash
# Terminal 1: Frontend
cd Business
npm install
npm run dev   # → http://localhost:3000

# Terminal 2: Backend
cd Business/backend
npm install
npm run start:dev   # → http://localhost:3001

# Database (if running locally)
# Install PostgreSQL and update backend/.env with your DATABASE_URL
```
