import React from 'react'
import Link from 'next/link'

import type { Post } from '@/utilities/posts'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { docs } = props

  if (!docs || docs.length === 0) return null

  return (
    <div>
      <h3 className="text-sm text-muted-foreground mb-4">related posts</h3>
      <div className="space-y-2">
        {docs.map((doc, index) => (
          <Link
            key={index}
            href={`/posts/${doc.slug}`}
            className="block text-sm hover:translate-x-1 transition-transform no-underline hover:underline"
          >
            → {doc.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
