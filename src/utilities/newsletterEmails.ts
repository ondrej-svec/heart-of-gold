import { getServerSideURL } from './getURL'

/**
 * Plain, deliverability-friendly HTML emails. No external CSS, inline styles
 * only, generous text fallbacks. Kept understated to match the site voice.
 */

const TEXT_COLOR = '#232136'
const MUTED = '#6e6a86'
const ACCENT = '#56526e'

function shell(bodyHtml: string, footerHtml = ''): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#faf4ed;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:${TEXT_COLOR};">
    ${bodyHtml}
    ${footerHtml}
  </div>
</body></html>`
}

export function confirmEmail(confirmUrl: string): {
  subject: string
  html: string
  text: string
} {
  const html = shell(
    `<p>Thanks for subscribing to my blog.</p>
     <p>Please confirm your email so I know it's really you:</p>
     <p style="margin:28px 0;">
       <a href="${confirmUrl}" style="display:inline-block;padding:12px 20px;background:${TEXT_COLOR};color:#faf4ed;text-decoration:none;border-radius:6px;">confirm subscription</a>
     </p>
     <p style="color:${MUTED};font-size:14px;">If the button doesn't work, paste this link into your browser:<br />
       <a href="${confirmUrl}" style="color:${ACCENT};">${confirmUrl}</a></p>
     <p style="color:${MUTED};font-size:14px;">If you didn't request this, you can safely ignore this email — you won't be subscribed.</p>`,
  )
  const text = `Thanks for subscribing to my blog.

Please confirm your email so I know it's really you:
${confirmUrl}

If you didn't request this, you can safely ignore this email — you won't be subscribed.`
  return { subject: 'Confirm your subscription', html, text }
}

export function postEmail(opts: {
  title: string
  contentHtml: string
  postUrl: string
  unsubscribeUrl: string
}): { subject: string; html: string; text: string } {
  const base = getServerSideURL()
  const footer = `
    <hr style="border:none;border-top:1px solid #dfdad9;margin:32px 0 16px;" />
    <p style="color:${MUTED};font-size:13px;line-height:1.5;">
      You're receiving this because you subscribed at
      <a href="${base}" style="color:${ACCENT};">${base.replace(/^https?:\/\//, '')}</a>.<br />
      <a href="${opts.unsubscribeUrl}" style="color:${ACCENT};">Unsubscribe</a> any time — one click, no questions.
    </p>`

  const html = shell(
    `<p style="color:${MUTED};font-size:13px;text-transform:lowercase;letter-spacing:0.04em;margin:0 0 8px;">new post</p>
     <h1 style="font-size:24px;line-height:1.3;margin:0 0 20px;">
       <a href="${opts.postUrl}" style="color:${TEXT_COLOR};text-decoration:none;">${escapeHtml(opts.title)}</a>
     </h1>
     ${opts.contentHtml}
     <p style="margin:28px 0;">
       <a href="${opts.postUrl}" style="display:inline-block;padding:12px 20px;background:${TEXT_COLOR};color:#faf4ed;text-decoration:none;border-radius:6px;">read on the site</a>
     </p>`,
    footer,
  )

  const text = `New post: ${opts.title}

Read it on the site: ${opts.postUrl}

—
Unsubscribe: ${opts.unsubscribeUrl}`

  return { subject: opts.title, html, text }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
