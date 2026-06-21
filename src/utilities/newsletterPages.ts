/**
 * Minimal standalone HTML pages for the confirm/unsubscribe GET endpoints.
 * Self-contained (no site chrome) so they render fast from a route handler and
 * still feel on-brand: Rosé Pine Dawn, JetBrains Mono, lowercase, understated.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function resultPage(opts: {
  title: string
  heading: string
  body: string
  base: string
  status: number
}): Response {
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${escapeHtml(opts.title)}</title>
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #faf4ed; color: #575279;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    padding: 24px;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #232136; color: #e0def4; }
    a { color: #c4a7e7 !important; }
  }
  .card { max-width: 32rem; text-align: center; }
  h1 { font-size: 1.5rem; font-weight: 600; letter-spacing: 0.01em; margin: 0 0 0.75rem; text-transform: lowercase; }
  p { font-size: 0.95rem; line-height: 1.6; margin: 0 0 1.5rem; }
  a { color: #56526e; text-decoration: none; border-bottom: 1px solid currentColor; }
</style>
</head>
<body>
  <main class="card">
    <h1>${escapeHtml(opts.heading)}</h1>
    <p>${escapeHtml(opts.body)}</p>
    <a href="${opts.base}">← back to the blog</a>
  </main>
</body></html>`

  return new Response(html, {
    status: opts.status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
