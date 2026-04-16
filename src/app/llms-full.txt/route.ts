import { getAllPosts } from '@/utilities/posts'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'

export async function GET() {
  const serverURL = getServerSideURL()
  const posts = getAllPosts()

  const lines: string[] = []
  lines.push('# Heart of Gold — Complete Content')
  lines.push('')
  lines.push(
    '> Personal website of Ondrej Svec. Coach, technologist, cyclist. All posts concatenated for LLM ingestion.',
  )
  lines.push('')
  lines.push(`Site: ${serverURL}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const post of posts) {
    lines.push(`# ${post.title}`)
    lines.push('')
    lines.push(`- URL: ${serverURL}/posts/${post.slug}`)
    lines.push(`- Type: ${post.blogType}`)
    lines.push(`- Published: ${post.publishedAt}`)
    lines.push(`- Author: ${post.authors.map((a) => a.name).join(', ')}`)
    if (post.meta?.description) {
      lines.push(`- Description: ${post.meta.description}`)
    }
    lines.push('')
    lines.push(post.content.trim())
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
