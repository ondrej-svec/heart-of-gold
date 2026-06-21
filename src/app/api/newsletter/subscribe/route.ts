import { NextResponse } from 'next/server'

import { getServerSideURL } from '@/utilities/getURL'
import {
  CONSENT_TEXT,
  CONSENT_VERSION,
  getFromAddress,
  getResend,
  getSql,
  isNewsletterConfigured,
  isValidEmail,
} from '@/utilities/newsletter'
import { confirmEmail } from '@/utilities/newsletterEmails'

export const dynamic = 'force-dynamic'

// Generic response that never reveals whether an address already exists.
const GENERIC = {
  ok: true,
  message: "If that address is valid, check your inbox to confirm you'd like to subscribe.",
}

type SubscriberRow = { token: string; status: string }

export async function POST(req: Request) {
  if (!isNewsletterConfigured()) {
    return NextResponse.json(
      { ok: false, message: 'Newsletter is not configured yet.' },
      { status: 503 },
    )
  }

  let body: { email?: unknown; consent?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const consent = body.consent === true

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: 'Please enter a valid email.' }, { status: 400 })
  }
  if (!consent) {
    return NextResponse.json(
      { ok: false, message: 'Please tick the consent box to subscribe.' },
      { status: 400 },
    )
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null

  try {
    const sql = getSql()

    // Upsert to pending with a fresh token, EXCEPT when already confirmed —
    // then leave the row untouched and don't re-send (still respond generically).
    const rows = (await sql`
      INSERT INTO subscribers (email, status, ip, consent_text, consent_version)
      VALUES (${email}, 'pending', ${ip}, ${CONSENT_TEXT}, ${CONSENT_VERSION})
      ON CONFLICT (email) DO UPDATE SET
        status = CASE WHEN subscribers.status = 'confirmed' THEN 'confirmed' ELSE 'pending' END,
        token = CASE WHEN subscribers.status = 'confirmed' THEN subscribers.token ELSE gen_random_uuid() END,
        ip = EXCLUDED.ip,
        consent_text = EXCLUDED.consent_text,
        consent_version = EXCLUDED.consent_version,
        unsubscribed_at = NULL
      RETURNING token, status
    `) as SubscriberRow[]

    const row = rows[0]

    // Only send a confirm email when the row is pending (new or re-subscribing).
    if (row && row.status === 'pending') {
      const confirmUrl = `${getServerSideURL()}/api/newsletter/confirm?token=${row.token}`
      const { subject, html, text } = confirmEmail(confirmUrl)
      await getResend().emails.send({
        from: getFromAddress(),
        to: email,
        subject,
        html,
        text,
      })
    }

    return NextResponse.json(GENERIC, { status: 200 })
  } catch (err) {
    console.error('[newsletter/subscribe]', err)
    // Don't leak internals; the generic copy still applies from the user's view.
    return NextResponse.json(
      { ok: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 },
    )
  }
}
