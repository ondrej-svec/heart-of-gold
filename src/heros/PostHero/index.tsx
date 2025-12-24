import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="max-w-[65ch] mx-auto px-6 pt-12 pb-8">
      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
          {categories.map((category, index) => {
            if (typeof category === 'object' && category !== null) {
              const { title: categoryTitle } = category
              const titleToUse = categoryTitle || 'Untitled'
              const isLast = index === categories.length - 1
              return (
                <React.Fragment key={index}>
                  {titleToUse}
                  {!isLast && ' · '}
                </React.Fragment>
              )
            }
            return null
          })}
        </div>
      )}

      {/* Title with slight rotation for personality */}
      <h1 className="text-2xl md:text-3xl font-normal mb-6 leading-tight rotate-slight-left">
        {title}
      </h1>

      {/* Meta info */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground border-b border-foreground/10 pb-8">
        {publishedAt && (
          <time dateTime={publishedAt} className="tabular-nums">
            {formatDateTime(publishedAt)}
          </time>
        )}
        {hasAuthors && (
          <span>
            by {formatAuthors(populatedAuthors)}
          </span>
        )}
      </div>
    </div>
  )
}
