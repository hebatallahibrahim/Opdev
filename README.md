# OP Dev. — Corporate Website

Marketing website for OP DEV: home, services (with request forms), industries,
case studies, insights, about and contact.

Built with Next.js 15 (App Router), Tailwind CSS 4, GSAP + Lenis for motion and
React Three Fiber for the 3D logo.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Sends form submissions by email via [Resend](https://resend.com). Without it, leads are only logged. |
| `INQUIRY_TO` | Where leads are delivered (default `info@opdev.ai`; comma-separate several). |
| `INQUIRY_FROM` | Sender address on the verified domain. |
| `NEXT_PUBLIC_BOOKING_URL` | Optional Cal.com / Calendly link shown on `/contact`. |

Never commit `.env.local` — it is git-ignored.

## Deploy (Vercel)

1. Import this repository at https://vercel.com/new (framework: Next.js, defaults are fine).
2. Add the environment variables above under **Settings → Environment Variables**.
3. Deploy. Every push to `main` redeploys automatically.

## Where things live

- `src/app/` — routes (pages and the `/api/inquiry` form endpoint)
- `src/content/` — page content as data (services, industries, case studies, insights) — ready to move to a CMS
- `src/components/` — sections and UI; `visuals/` holds the interactive card drawings
- `src/lib/` — scroll, 3D scene state, email, logo geometry

## Content still to confirm with the client

- Case studies are sample projects — replace with verified work.
- Insight articles are first drafts for review.
- Mission & vision on `/about` are drafts.
- Heading font: Gordita (licensed) — Plus Jakarta Sans stands in until the files are supplied.
