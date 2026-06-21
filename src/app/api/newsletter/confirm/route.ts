import { getServerSideURL } from '@/utilities/getURL'
import { getSql, isDbConfigured } from '@/utilities/newsletter'
import { resultPage } from '@/utilities/newsletterPages'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(req: Request) {
  const base = getServerSideURL()

  if (!isDbConfigured()) {
    return resultPage({
      title: 'Newsletter not available',
      heading: 'not available yet',
      body: 'The newsletter isn’t configured yet. Please try again later.',
      base,
      status: 503,
    })
  }

  const token = new URL(req.url).searchParams.get('token') ?? ''
  if (!UUID_RE.test(token)) {
    return resultPage({
      title: 'Invalid link',
      heading: 'this link looks off',
      body: 'That confirmation link is invalid or has expired. Try subscribing again.',
      base,
      status: 400,
    })
  }

  try {
    const sql = getSql()
    // Confirm only pending/confirmed rows; idempotent for already-confirmed.
    const rows = (await sql`
      UPDATE subscribers
      SET status = 'confirmed',
          confirmed_at = COALESCE(confirmed_at, now()),
          unsubscribed_at = NULL
      WHERE token = ${token} AND status IN ('pending', 'confirmed')
      RETURNING email
    `) as Array<{ email: string }>

    if (rows.length === 0) {
      return resultPage({
        title: 'Invalid link',
        heading: 'this link looks off',
        body: 'That confirmation link is invalid or has expired. Try subscribing again.',
        base,
        status: 400,
      })
    }

    return resultPage({
      title: 'Subscription confirmed',
      heading: 'you’re in',
      body: 'Thanks for confirming. You’ll get new posts by email — nothing else.',
      base,
      status: 200,
    })
  } catch (err) {
    console.error('[newsletter/confirm]', err)
    return resultPage({
      title: 'Something went wrong',
      heading: 'something went wrong',
      body: 'Please try the link again in a moment.',
      base,
      status: 500,
    })
  }
}
