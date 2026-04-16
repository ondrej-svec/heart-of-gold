import type { Metadata } from 'next'
import Link from 'next/link'
import { getRecentPosts } from '@/utilities/posts'

export const metadata: Metadata = {
  title: 'Ondrej Svec',
  description:
    'ICF ACC Coach, software architect, and perpetual learner. Cultivating systems for wholehearted living.',
}

export default async function HomePage() {
  const recentPosts = getRecentPosts(5)

  return (
    <div className="max-w-[65ch] mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-2xl font-normal mb-2 rotate-slight-left">hey, i&apos;m ondrej</h1>
        <p className="text-xl text-muted-foreground underline-tilde">~~~~~~~~~~~~</p>

        <div className="mt-8 text-sm leading-relaxed space-y-4 text-muted-foreground">
          <p>coach, technologist, cyclist.</p>
          <p>
            i explore what changes about us when AI enters the room —
            the teams, the connections, the human parts.
          </p>
          <p>i write, i build, i wander.</p>
        </div>

        <nav className="mt-8 flex gap-6 text-sm">
          <Link href="/writing" className="hover-wobble">→ writing</Link>
          <Link href="/wandering" className="hover-wobble">→ wandering</Link>
          <Link href="/about" className="hover-wobble">→ about</Link>
        </nav>
      </header>

      <div className="text-muted-foreground opacity-40 text-xs mb-8">
        ────────────────────────────────────────
      </div>

      <section>
        <h2 className="text-sm text-muted-foreground mb-6">recent</h2>

        {recentPosts.length === 0 ? (
          <p className="text-muted-foreground text-sm">nothing here yet. check back soon.</p>
        ) : (
          <div className="space-y-1">
            {recentPosts.map((post, index) => {
              const publishedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : null

              const rotationClass = index % 4 === 2 ? 'rotate-slight-right' : ''

              return (
                <article
                  key={post.slug}
                  className={`group py-3 border-b border-foreground/10 last:border-b-0 ${rotationClass}`}
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 no-underline hover:no-underline"
                  >
                    {publishedDate && (
                      <time className="text-xs text-muted-foreground tabular-nums shrink-0 w-24">
                        {publishedDate}
                      </time>
                    )}
                    <span className="text-base font-normal group-hover:translate-x-1 transition-transform">
                      {post.title}
                    </span>
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
