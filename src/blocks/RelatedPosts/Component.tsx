import React from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'

import type { Post } from '@/payload-types'

import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { docs, introContent } = props

  if (!docs || docs.length === 0) return null

  return (
    <div>
      <h3 className="text-sm text-muted-foreground mb-4">related posts</h3>

      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="space-y-2">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <Link
              key={index}
              href={`/posts/${doc.slug}`}
              className="block text-sm hover:translate-x-1 transition-transform no-underline hover:underline"
            >
              → {doc.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
