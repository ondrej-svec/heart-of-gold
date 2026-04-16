import { getPostBySlug } from '@/utilities/posts'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

type Args = {
  params: Promise<{ slug: string }>
}

export async function GET(_req: Request, { params }: Args) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const frontmatter = [
    `title: ${post.title}`,
    `slug: ${post.slug}`,
    `blogType: ${post.blogType}`,
    `publishedAt: ${post.publishedAt}`,
    post.meta?.description ? `description: ${post.meta.description}` : null,
    `authors: ${post.authors.map((a) => a.name).join(', ')}`,
  ]
    .filter(Boolean)
    .join('\n')

  const body = `---\n${frontmatter}\n---\n\n# ${post.title}\n\n${post.content}\n`

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
