# SalonAI Admin CMS

Content management for the Client marketing website.

## Setup

1. Copy env file:

```bash
copy .env.example .env.local
```

2. Set MySQL credentials in `.env.local`

3. Create tables + seed data:

```bash
npm run db:setup
```

4. Start admin (port **3001**):

```bash
npm run dev
```

Open http://localhost:3001

Default login (from `.env.local`):

- Email: `admin@avenque.com`
- Password: `admin123`

## Features

- Page section CMS (Home, About, Features, Pricing, Blog, FAQ, Contact)
- Media uploads (`/uploads/...`)
- Blog posts, FAQs, Pricing plans
- Public content API: `GET /api/public/content/[slug]`
