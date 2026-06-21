import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

import { getPostBySlug, getAllSlugs, getRelatedPosts } from '@/utilities/posts'
import { PostHero } from '@/heros/PostHero'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { getMDXComponents } from '@/mdx-components'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import PageClient from './page.client'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const post = getPostBySlug(slug)

  if (!post) return notFound()

  const components = getMDXComponents({})
  const related = post.relatedPosts.length > 0 ? getRelatedPosts(post.relatedPosts) : []

  const serverURL = getServerSideURL()
  const rawImage = post.meta?.image || post.heroImage
  const absoluteImage = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${serverURL}${rawImage}`
    : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta?.description,
    datePublished: post.publishedAt,
    author: post.authors.map((a) => ({ '@type': 'Person', name: a.name })),
    ...(absoluteImage ? { image: absoluteImage } : {}),
    url: `${serverURL}/posts/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${serverURL}/posts/${post.slug}`,
    },
  }

  return (
    <article className="pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageClient />

      <PostHero post={post} />

      <link
        rel="alternate"
        type="text/markdown"
        href={`${serverURL}/posts/${post.slug}/md`}
        title={`${post.title} (Markdown)`}
      />


      <div className="max-w-[65ch] mx-auto px-6">
        <div className="prose-mono">
          <MDXRemote
            source={post.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-foreground/10">
            <RelatedPosts docs={related} />
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = getPostBySlug(slug)

  if (!post) return {}

  const serverURL = getServerSideURL()
  const metaTitle = post.meta?.title || `${post.title} | Heart of Gold`
  const metaDescription = post.meta?.description || ''

  // A real photo (meta.image or heroImage) wins; otherwise generate a branded
  // text card from the post title. Always resolve to an absolute URL.
  const rawImage = post.meta?.image || post.heroImage
  const ogImage = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${serverURL}${rawImage}`
    : `${serverURL}/og?title=${encodeURIComponent(post.title)}`

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: mergeOpenGraph({
      title: metaTitle,
      description: metaDescription,
      url: `/posts/${post.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    }),
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  }
}
