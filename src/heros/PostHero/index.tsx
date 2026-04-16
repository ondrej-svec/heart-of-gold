import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/utilities/posts'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, authors, publishedAt, title } = post

  const authorNames = authors.map((a) => a.name).filter(Boolean)
  const hasAuthors = authorNames.length > 0

  return (
    <div className="max-w-[65ch] mx-auto px-6 pt-12 pb-8">
      {categories.length > 0 && (
        <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
          {categories.map((category, index) => {
            const isLast = index === categories.length - 1
            return (
              <React.Fragment key={index}>
                {category}
                {!isLast && ' · '}
              </React.Fragment>
            )
          })}
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-normal mb-6 leading-tight rotate-slight-left">
        {title}
      </h1>

      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground border-b border-foreground/10 pb-8">
        {publishedAt && (
          <time dateTime={publishedAt} className="tabular-nums">
            {formatDateTime(publishedAt)}
          </time>
        )}
        {hasAuthors && (
          <span>by {authorNames.join(', ')}</span>
        )}
      </div>
    </div>
  )
}
