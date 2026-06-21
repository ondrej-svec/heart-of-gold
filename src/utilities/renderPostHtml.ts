import { marked } from 'marked'

import { getServerSideURL } from './getURL'
import type { Post } from './posts'

/**
 * Render a post's MDX content to a clean, self-contained HTML string suitable
 * for RSS `content:encoded` and for newsletter email bodies.
 *
 * The site renders MDX through React Server Components with styled custom
 * components (AudioBlock, Banner, prism code blocks). None of that survives
 * outside the site, so for feeds/email we degrade the custom MDX components to
 * plain markdown, render standard markdown → HTML, and absolutise every URL.
 */

/** Degrade custom MDX/JSX components to plain markdown before parsing. */
function degradeMdx(content: string): string {
  let out = content

  // <AudioBlock src="..." title="..." /> → a labelled link to the audio file.
  out = out.replace(/<AudioBlock\b([^>]*?)\/?>/g, (_match, attrs: string) => {
    const src = /src=["']([^"']*)["']/.exec(attrs)?.[1] ?? ''
    const title = (/title=["']([^"']*)["']/.exec(attrs)?.[1] ?? '').trim() || 'Listen to this post'
    if (!src) return ''
    return `\n\n🎧 [${title}](${src})\n\n`
  })

  // <Banner style="...">children</Banner> → a blockquote carrying the children.
  out = out.replace(
    /<Banner\b[^>]*>([\s\S]*?)<\/Banner>/g,
    (_match, inner: string) => `\n\n> ${inner.trim().replace(/\n+/g, ' ')}\n\n`,
  )

  return out
}

/** Rewrite root-relative `src`/`href` to absolute URLs (skips protocol-relative `//`). */
function absolutiseUrls(html: string, base: string): string {
  return html.replace(/\b(src|href)="\/(?!\/)/g, `$1="${base}/`)
}

export function renderPostHtml(post: Pick<Post, 'content' | 'heroImage' | 'title'>): string {
  const base = getServerSideURL()

  const markdown = degradeMdx(post.content)
  let html = marked.parse(markdown, { async: false, gfm: true }) as string
  html = absolutiseUrls(html, base)

  if (post.heroImage) {
    const hero = post.heroImage.startsWith('http') ? post.heroImage : `${base}${post.heroImage}`
    html = `<p><img src="${hero}" alt="${escapeAttr(post.title)}" /></p>\n${html}`
  }

  return html
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
