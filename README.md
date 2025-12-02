# PWEB-BACKEND

Node.js + Express + TypeScript + Prisma (PostgreSQL)

## Local Development

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install deps and start dev:

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```
- Compiles TS to `dist/` and copies `generated/` to `dist/generated/`.
- Start production build locally:

```powershell
npm start
```

## Prisma

- Apply migrations against your DB (production-safe):

```powershell
npm run prisma:migrate
```

## Deploy to Render

- Create a new Web Service from this repo.
- Environment: `Node`
- Build Command:

```bash
npm ci && npm run render-build
```

- Start Command:

```bash
npm start
```

- Environment Variables:
  - `DATABASE_URL`: Use the Internal Connection String from your Render PostgreSQL instance (or external). Include `sslmode=require`.
  - `JWT_SECRET`: Any strong secret.

Notes:
- The server listens on `process.env.PORT` (Render injects it).
- Migrations run during build via `npm run prisma:migrate`.
- Prisma Client is generated at build and bundled into `dist/generated/`.
