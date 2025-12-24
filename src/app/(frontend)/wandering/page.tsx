import type { Metadata } from 'next'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata: Metadata = {
  title: 'Wandering | Ondrej Svec',
  description: 'Adventures, van life, and stories from the road',
}

export default async function WanderingPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    where: {
      blogType: {
        equals: 'wandering',
      },
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    limit: 50,
  })

  return (
    <div className="max-w-[65ch] mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-2xl font-normal mb-4 rotate-slight-right">wandering</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          adventures from the road, van life realities, and stories from
          unconventional living. following the light trails under the stars.
        </p>
        <div className="mt-4 text-muted-foreground opacity-40 text-xs">
          ────────────────────────────────────────
        </div>
      </header>

      {/* Posts */}
      {posts.docs.length === 0 ? (
        <div className="py-8">
          <p className="text-muted-foreground mb-4">no posts yet. check back soon.</p>
          <Link href="/admin" className="text-sm">
            create your first post →
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {posts.docs.map((post, index) => {
            const publishedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : null

            // Add slight rotation to some posts for personality
            const rotationClass = index % 4 === 1 ? 'rotate-slight-left' : ''

            return (
              <article
                key={post.id}
                className={`group py-4 border-b border-foreground/10 last:border-b-0 ${rotationClass}`}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 no-underline hover:no-underline"
                >
                  {/* Date */}
                  {publishedDate && (
                    <time className="text-xs text-muted-foreground tabular-nums shrink-0 w-24">
                      {publishedDate}
                    </time>
                  )}

                  {/* Title */}
                  <h2 className="text-base font-normal group-hover:translate-x-1 transition-transform">
                    {post.title}
                  </h2>
                </Link>

                {/* Description - subtle */}
                {post.meta?.description && (
                  <p className="text-sm text-muted-foreground mt-2 sm:ml-28 line-clamp-2">
                    {post.meta.description}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
