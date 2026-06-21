import { NextResponse } from 'next/server'

import { getServerSideURL } from '@/utilities/getURL'
import { getAllPosts } from '@/utilities/posts'
import { renderPostHtml } from '@/utilities/renderPostHtml'
import {
  DAILY_SEND_CAP,
  getFromAddress,
  getResend,
  getSql,
  getState,
  isNewsletterConfigured,
  setState,
} from '@/utilities/newsletter'
import { postEmail } from '@/utilities/newsletterEmails'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const LAST_SENT_KEY = 'last_sent_guid'
const LOCK_KEY = 'send_lock'

/** Atomically acquire a send lock; returns false if another run holds a fresh one. */
async function acquireLock(): Promise<boolean> {
  const sql = getSql()
  const rows = (await sql`
    INSERT INTO newsletter_state (key, value, updated_at)
    VALUES (${LOCK_KEY}, 'locked', now())
    ON CONFLICT (key) DO UPDATE SET value = 'locked', updated_at = now()
    WHERE newsletter_state.updated_at < now() - interval '5 minutes'
       OR newsletter_state.value <> 'locked'
    RETURNING key
  `) as Array<{ key: string }>
  return rows.length > 0
}

async function releaseLock(): Promise<void> {
  try {
    await setState(LOCK_KEY, 'free')
  } catch {
    /* staleness lets the next run proceed anyway */
  }
}

export async function GET(req: Request) {
  // Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically.
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (!isNewsletterConfigured()) {
    return NextResponse.json({ ok: false, message: 'Newsletter not configured' }, { status: 503 })
  }

  const base = getServerSideURL()
  const latest = getAllPosts()[0] // newest-first, drafts excluded in production
  if (!latest) {
    return NextResponse.json({ ok: true, sent: 0, reason: 'no posts' })
  }

  const guid = `${base}/posts/${latest.slug}`

  let locked = false
  try {
    const lastSent = await getState(LAST_SENT_KEY)
    if (lastSent === guid) {
      return NextResponse.json({ ok: true, sent: 0, reason: 'already sent', guid })
    }

    locked = await acquireLock()
    if (!locked) {
      return NextResponse.json({ ok: true, sent: 0, reason: 'another run in progress' })
    }

    // Re-check inside the lock to avoid a race that double-sends.
    if ((await getState(LAST_SENT_KEY)) === guid) {
      return NextResponse.json({ ok: true, sent: 0, reason: 'already sent', guid })
    }

    const sql = getSql()
    const subs = (await sql`
      SELECT email, token FROM subscribers WHERE status = 'confirmed' ORDER BY confirmed_at ASC
    `) as Array<{ email: string; token: string }>

    if (subs.length === 0) {
      // No recipients yet — still advance so the first real subscriber doesn't
      // get a backlog blast of this already-published post.
      await setState(LAST_SENT_KEY, guid)
      return NextResponse.json({ ok: true, sent: 0, reason: 'no confirmed subscribers', guid })
    }

    const recipients = subs.slice(0, DAILY_SEND_CAP)
    const skipped = subs.length - recipients.length
    if (skipped > 0) {
      console.warn(
        `[newsletter/check] Daily cap ${DAILY_SEND_CAP} hit: ${skipped} subscriber(s) will NOT receive "${latest.title}". Upgrade Resend or batch over days.`,
      )
    }

    const contentHtml = renderPostHtml(latest)
    const postUrl = guid
    const from = getFromAddress()

    const batch = recipients.map(({ email, token }) => {
      const unsubscribeUrl = `${base}/api/newsletter/unsubscribe?token=${token}`
      const { subject, html, text } = postEmail({
        title: latest.title,
        contentHtml,
        postUrl,
        unsubscribeUrl,
      })
      return {
        from,
        to: email,
        subject,
        html,
        text,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }
    })

    const { error } = await getResend().batch.send(batch)
    if (error) {
      // Do NOT advance the guid — a clean retry next run resends to everyone.
      console.error('[newsletter/check] Resend batch error:', error)
      return NextResponse.json({ ok: false, message: 'Send failed', error: String(error) }, { status: 502 })
    }

    // Success → advance the marker so we never resend this post.
    await setState(LAST_SENT_KEY, guid)
    return NextResponse.json({ ok: true, sent: recipients.length, skipped, guid })
  } catch (err) {
    console.error('[newsletter/check]', err)
    return NextResponse.json({ ok: false, message: 'Internal error' }, { status: 500 })
  } finally {
    if (locked) await releaseLock()
  }
}
