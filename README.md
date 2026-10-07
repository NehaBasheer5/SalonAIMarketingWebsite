# SalonAI Marketing Website

Marketing website + headless CMS for **Avenque SalonAI** — an all-in-one AI salon management platform (bookings, staff, customers, payments, loyalty, analytics & AI insights).

This repo contains **two independent Next.js apps**:

| App | Path | Description | Port |
|---|---|---|---|
| **Client** | `Client/` | Public marketing site (Home, Features, Pricing, Blog, FAQ, Contact, Demo) | `3000` |
| **Admin** | `admin/` | Headless CMS + dashboard with MySQL, JWT auth, and a public read API | `3001` |

## Architecture

The Client **never touches MySQL**. It server-side fetches content from the Admin's public API and merges it over built-in TypeScript defaults (`Client/src/lib/content.ts`).

```
Browser ──> Client (Next.js :3000) ──4s timeout──> Admin public API (:3001) ──> MySQL
                 │                                        │
                 └── falls back to built-in defaults      └── CMS edits (pages, blog,
                     if CMS is offline                        FAQ, pricing, media)
```

**If the CMS goes down, the marketing site still renders fully from defaults.**

Forms (contact / demo / newsletter) POST to `Admin /api/public/enquiries`.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5.9**
- **Tailwind CSS** (v3 in Client, v4 in Admin)
- **Framer Motion** (Client animations), **Recharts** (Admin dashboard)
- **MySQL 8** via `mysql2` (Admin only)
- **JWT auth** via `jose` + `bcryptjs` (httpOnly cookie, 7-day expiry)

> Note: The two apps have separate `package.json` files, lockfiles, and even different Tailwind majors — always install, run, and build them **separately**.

## Prerequisites

- Node.js 18.18+ / 20+
- MySQL 8.x (only required for the Admin app; the Client runs fine without a database)

## Getting Started

### 1. Admin CMS (start this first)

```powershell
cd admin
copy .env.example .env.local    # then edit MySQL credentials + AUTH_SECRET
npm install
npm run db:setup                # creates tables + seeds content & admin user
npm run dev                     # http://localhost:3001
```

Login: **admin@avenque.com** / **admin123** (change via `.env.local` before seeding)

### 2. Client marketing site

```powershell
cd Client
copy .env.example .env.local    # CONTENT_API_URL & NEXT_PUBLIC_ADMIN_URL → http://localhost:3001
npm install
npm run dev                     # http://localhost:3000
```

## Environment Variables

### `Client/.env.local`

| Variable | Purpose |
|---|---|
| `CONTENT_API_URL` | Base URL of the Admin read API (empty = use built-in defaults only) |
| `NEXT_PUBLIC_ADMIN_URL` | Resolves `/uploads/...` media URLs to the Admin origin |

### `admin/.env.local`

| Variable | Purpose |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | MySQL connection |
| `AUTH_SECRET` | Long random string for JWT signing |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seed admin login |
| `NEXT_PUBLIC_APP_URL` | Admin app origin |

## Scripts

| Command | Client | Admin |
|---|---|---|
| `npm run dev` | `next dev` (:3000) | `next dev -p 3001` |
| `npm run build` | `next build` | `next build` |
| `npm run start` | `next start` | `next start -p 3001` |
| `npm run lint` | `next lint` | `eslint` |
| `npm run db:setup` | — | `tsx scripts/setup-db.ts` |

## Project Structure

```
SalonAIMarketingWebsite/
├── Client/                     # Public marketing site
│   ├── public/images/
│   └── src/
│       ├── app/                # /, /features, /pricing, /about, /blog, /faq, /contact, /request-demo, /login
│       ├── components/
│       │   ├── layout/         # Navbar, Footer (CMS-editable)
│       │   ├── sections/       # Page sections per route
│       │   └── ui/             # Button, CmsImage, MarkdownContent, icons
│       └── lib/
│           ├── content.ts      # ~1900-line content layer: types + defaults + CMS merge
│           └── cms/            # FAQ fetch helpers
│
└── admin/                      # CMS + dashboard
    ├── sql/schema.sql          # CREATE TABLE IF NOT EXISTS
    ├── scripts/setup-db.ts     # db setup + idempotent seed
    └── src/
        ├── middleware.ts       # JWT guard for all admin routes
        ├── lib/                # db pool, auth, section specs, media
        ├── app/
        │   ├── (dashboard)/    # Overview, Enquiries, Pages, Media, Blog, FAQs, Pricing
        │   └── api/
        │       ├── auth/       # login, logout
        │       ├── pages|media|blog|faqs|pricing|enquiries   # authenticated CRUD
        │       └── public/     # CORS *, unauthenticated read API + POST /enquiries
        └── components/         # PageContentEditor, MediaPicker, MarkdownEditor, charts
```

## Admin Features

- **Auth** — bcrypt + jose HS256 JWT in httpOnly `salon_admin_session` cookie; middleware protects everything except `/login`, `/api/auth/*`, `/api/public/*`, `/uploads/*`
- **Page-section CMS** — edit every section of every page (visibility, sort order, structured content)
- **Media library** — image/video uploads served from `/uploads/...`
- **Blog CRUD** — markdown bodies, categories, tags, featured posts, cover media
- **FAQ & Pricing CRUD** — plans with monthly/annual toggle support
- **Enquiries inbox** — live unread badge, list/update/delete
- **Dashboard** — overview charts (Recharts)

### Public API (CORS `*`, `Cache-Control: no-store`)

```
GET  /api/public/content/[slug]
GET  /api/public/pricing
GET  /api/public/faqs
GET  /api/public/blog
GET  /api/public/blog/[slug]
POST /api/public/enquiries
```

## Database

Schema: `admin/sql/schema.sql` — tables: `admins`, `pages`, `page_sections`, `media`, `blog_posts`, `pricing_plans`, `faqs`, `enquiries` (database: `salon_marketing`).

Run `npm run db:setup` in `admin/` to create tables and seed content (idempotent — safe to re-run).

## Deployment

No deployment config is checked in yet. Deploy as **two separate apps** (e.g. two Vercel projects):

- **Client** — set `CONTENT_API_URL` and `NEXT_PUBLIC_ADMIN_URL` to the deployed Admin origin
- **Admin** — set all `DB_*`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_APP_URL`; requires a host with **persistent disk** (for `public/uploads/`) and a managed MySQL instance
