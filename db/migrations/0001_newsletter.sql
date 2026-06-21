-- Newsletter schema for the self-hosted (Neon + Resend + Vercel Cron) newsletter.
-- Apply once against the Neon database (e.g. `psql "$DATABASE_URL" -f db/migrations/0001_newsletter.sql`).
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS subscribers (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email            TEXT NOT NULL UNIQUE,
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  token            UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at     TIMESTAMPTZ,
  unsubscribed_at  TIMESTAMPTZ,
  ip               TEXT,
  consent_text     TEXT,
  consent_version  TEXT
);

-- Fast lookups by the per-subscriber opt-in/opt-out token.
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_token_idx ON subscribers (token);

-- Confirmed-list scans for the send job.
CREATE INDEX IF NOT EXISTS subscribers_status_idx ON subscribers (status);

-- Single-row-per-key state, e.g. last_sent_guid (the canonical URL of the last
-- post that was emailed) and a transient send lock.
CREATE TABLE IF NOT EXISTS newsletter_state (
  key    TEXT PRIMARY KEY,
  value  TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
