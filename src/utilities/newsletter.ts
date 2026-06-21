import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'

/**
 * Shared configuration + clients for the self-hosted newsletter.
 *
 * Everything here degrades gracefully when the relevant env vars are absent so
 * the site keeps building and running before the author provisions Neon/Resend.
 * Routes should call the `*Configured` guards and return 503 when unconfigured
 * rather than throwing at import time.
 */

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NEWSLETTER_FROM)
}

/** Whether the full subscribe→send loop can run. */
export function isNewsletterConfigured(): boolean {
  return isDbConfigured() && isResendConfigured()
}

/** Neon SQL tagged-template client. Throws if DATABASE_URL is missing. */
export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set — newsletter database is not configured.')
  }
  return neon(url)
}

/** Resend client. Throws if RESEND_API_KEY is missing. */
export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY is not set — email sending is not configured.')
  }
  return new Resend(key)
}

/** Verified sender, e.g. `Ondrej <hi@ondrejsvec.com>`. */
export function getFromAddress(): string {
  return process.env.NEWSLETTER_FROM || 'Ondrej <noreply@ondrejsvec.com>'
}

/** Current consent-copy version — bump when the consent wording changes. */
export const CONSENT_VERSION = '2026-06-21'

export const CONSENT_TEXT =
  'I agree to receive new blog posts by email from Ondrej Svec and understand I can unsubscribe at any time.'

/** Free-tier guardrail: Resend allows 100 recipients/day on the free plan. */
export const DAILY_SEND_CAP = 100

/** Basic email shape check — deliberately permissive, real validation is the opt-in. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim().length <= 254
}

// --- newsletter_state helpers ---

export async function getState(key: string): Promise<string | null> {
  const sql = getSql()
  const rows = (await sql`SELECT value FROM newsletter_state WHERE key = ${key}`) as Array<{
    value: string | null
  }>
  return rows[0]?.value ?? null
}

export async function setState(key: string, value: string): Promise<void> {
  const sql = getSql()
  await sql`
    INSERT INTO newsletter_state (key, value, updated_at)
    VALUES (${key}, ${value}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `
}
