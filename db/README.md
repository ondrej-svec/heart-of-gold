# Newsletter database & setup

Self-hosted newsletter: **Neon** (subscribers) + **Resend** (sending) + **Vercel Cron** (auto-send on new post).
Neon is the single source of truth; Resend is used only to send.

## 1. Apply the schema

```bash
psql "$DATABASE_URL" -f db/migrations/0001_newsletter.sql
```

Creates `subscribers` and `newsletter_state`. The file is idempotent.

## 2. Environment variables

Set these in Vercel (Production + Preview) and in `.env.local` for dev:

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SERVER_URL` | Absolute site URL, no trailing slash (feed/email links). |
| `DATABASE_URL` | Neon **pooled** connection string. |
| `RESEND_API_KEY` | Resend API key from the verified `ondrejsvec.com` domain. |
| `NEWSLETTER_FROM` | Verified From, e.g. `Ondrej <hi@ondrejsvec.com>`. |
| `CRON_SECRET` | Long random string; gates `GET /api/newsletter/check`. |
| `NEXT_PUBLIC_NEWSLETTER_ENABLED` | Set to `1` to render the public subscribe form (soft-launch switch). |

The subscribe/confirm/unsubscribe routes and the cron send all degrade to `503`
when their env vars are missing, so the site is safe to deploy before these
exist. The subscribe form only renders when `NEXT_PUBLIC_NEWSLETTER_ENABLED=1`.

## 3. Author actions (one-time)

- Provision a Neon database/branch; copy the pooled connection string → `DATABASE_URL`.
- In Resend: verify the `ondrejsvec.com` sending domain (add DKIM/SPF/DMARC DNS
  records), create an API key, and **sign Resend's DPA** (GDPR Art. 28).
- Add all env vars in Vercel; confirm the daily cron is enabled after deploy.

## Endpoints

| Route | Purpose |
|-------|---------|
| `GET /feed.xml` | Full-content RSS (also the send source of truth). |
| `POST /api/newsletter/subscribe` | Double opt-in: stores `pending`, emails a confirm link. |
| `GET /api/newsletter/confirm?token=` | Marks `confirmed`. |
| `GET /api/newsletter/unsubscribe?token=` | One-click `unsubscribed`. |
| `GET /api/newsletter/check` | Cron (Bearer `CRON_SECRET`): emails the latest new post exactly once. |
