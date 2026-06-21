import { getAllPosts } from '@/utilities/posts'
import { getServerSideURL } from '@/utilities/getURL'
import { renderPostHtml } from '@/utilities/renderPostHtml'

// Route handlers aren't cached by default in Next 15; we additionally hint a
// short shared cache so the feed isn't rebuilt on every poll.
export const dynamic = 'force-static'
export const revalidate = 3600

const SITE_TITLE = 'Ondrej Svec'
const SITE_DESCRIPTION = 'Writing and wanderings — heart of gold.'

/** Escape text for inclusion in an XML element/attribute. */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Wrap HTML in CDATA, neutralising any literal `]]>` that would close it early. */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

/** RFC-822 date string from a `YYYY-MM-DD` (or Date-parseable) value. */
function rfc822(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date(0).toUTCString() : date.toUTCString()
}

/** Plain-text excerpt fallback for `<description>` when no meta description exists. */
function excerpt(content: string, max = 280): string {
  const text = content
    .replace(/<[^>]+>/g, ' ') // strip JSX/HTML tags
    .replace(/[#>*_`~[\]()!-]/g, ' ') // strip common markdown punctuation
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

export async function GET() {
  const base = getServerSideURL()
  const posts = getAllPosts() // newest-first; drafts excluded in production
  const feedUrl = `${base}/feed.xml`
  const lastBuild = posts[0] ? rfc822(posts[0].publishedAt) : new Date(0).toUTCString()

  const items = posts
    .map((post) => {
      const url = `${base}/posts/${post.slug}`
      const description = post.meta?.description || excerpt(post.content)
      const contentHtml = renderPostHtml(post)
      const categories = (post.categories ?? [])
        .map((c) => `      <category>${xmlEscape(c)}</category>`)
        .join('\n')

      return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${rfc822(post.publishedAt)}</pubDate>
      <author>noreply@ondrejsvec.com (${xmlEscape(post.authors.map((a) => a.name).join(', '))})</author>
${categories ? `${categories}\n` : ''}      <description>${cdata(description)}</description>
      <content:encoded>${cdata(contentHtml)}</content:encoded>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_TITLE)}</title>
    <link>${xmlEscape(base)}</link>
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
