import { getPostsByType } from '@/utilities/posts'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'

export async function GET() {
  const serverURL = getServerSideURL()
  const writing = getPostsByType('writing')
  const wandering = getPostsByType('wandering')

  const lines: string[] = []
  lines.push('# Heart of Gold — Ondrej Svec')
  lines.push('')
  lines.push(
    '> Personal website of Ondrej Svec. Coach, technologist, cyclist. Explores what changes about us when AI enters the room — teams, connections, the human parts. Writing on wholehearted living, leadership, and the courage to slow down. Wandering from the road, van life, and stories from unconventional living.',
  )
  lines.push('')
  lines.push('Full markdown of any post is available by appending `/md` to the post URL.')
  lines.push(`See [${serverURL}/llms-full.txt](${serverURL}/llms-full.txt) for all post content in one file.`)
  lines.push('')

  lines.push('## Writing')
  for (const post of writing) {
    const desc = post.meta?.description || ''
    lines.push(`- [${post.title}](${serverURL}/posts/${post.slug}): ${desc}`)
  }
  lines.push('')

  if (wandering.length > 0) {
    lines.push('## Wandering')
    for (const post of wandering) {
      const desc = post.meta?.description || ''
      lines.push(`- [${post.title}](${serverURL}/posts/${post.slug}): ${desc}`)
    }
    lines.push('')
  }

  lines.push('## Optional')
  lines.push(`- [About Ondrej](${serverURL}/about): Background, journey from tech leadership to coaching, and current work at the intersection of AI and human teams.`)
  lines.push('')

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
