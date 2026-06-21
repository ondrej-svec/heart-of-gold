import { getServerSideURL } from '@/utilities/getURL'
import { getSql, isDbConfigured } from '@/utilities/newsletter'
import { resultPage } from '@/utilities/newsletterPages'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function unsubscribe(token: string, base: string): Promise<Response> {
  if (!UUID_RE.test(token)) {
    return resultPage({
      title: 'Invalid link',
      heading: 'this link looks off',
      body: 'That unsubscribe link is invalid. If you keep getting emails, just reply and let me know.',
      base,
      status: 400,
    })
  }

  try {
    const sql = getSql()
    await sql`
      UPDATE subscribers
      SET status = 'unsubscribed', unsubscribed_at = now()
      WHERE token = ${token}
    `
    // Always show success — idempotent, never reveals whether the token existed.
    return resultPage({
      title: 'Unsubscribed',
      heading: 'you’re unsubscribed',
      body: 'Done. You won’t get any more emails. No hard feelings — the door’s always open.',
      base,
      status: 200,
    })
  } catch (err) {
    console.error('[newsletter/unsubscribe]', err)
    return resultPage({
      title: 'Something went wrong',
      heading: 'something went wrong',
      body: 'Please try the link again in a moment.',
      base,
      status: 500,
    })
  }
}

export async function GET(req: Request) {
  const base = getServerSideURL()
  if (!isDbConfigured()) {
    return resultPage({
      title: 'Newsletter not available',
      heading: 'not available yet',
      body: 'The newsletter isn’t configured yet.',
      base,
      status: 503,
    })
  }
  const token = new URL(req.url).searchParams.get('token') ?? ''
  return unsubscribe(token, base)
}

// RFC 8058 one-click unsubscribe (List-Unsubscribe-Post) sends a POST.
export async function POST(req: Request) {
  const base = getServerSideURL()
  if (!isDbConfigured()) {
    return new Response(null, { status: 503 })
  }
  const token = new URL(req.url).searchParams.get('token') ?? ''
  await unsubscribe(token, base)
  // Mail clients just need a 2xx; no body required for one-click POST.
  return new Response(null, { status: 200 })
}
