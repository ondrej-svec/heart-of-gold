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

  return (
    <article className="pb-16">
      <PageClient />

      <PostHero post={post} />

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
  const ogImage = post.meta?.image || post.heroImage || `${serverURL}/website-template-OG.webp`

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: mergeOpenGraph({
      title: metaTitle,
      description: metaDescription,
      url: `/posts/${post.slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
    }),
  }
}
