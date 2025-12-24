'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, publishedAt } = doc || {}
  const { description } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const href = `/${relationTo}/${slug}`

  // Format date simply
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <article
      className={cn(
        'group py-4 border-b border-foreground/10 last:border-b-0 hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
        {/* Date */}
        {formattedDate && (
          <time className="text-xs text-muted-foreground tabular-nums shrink-0 w-24">
            {formattedDate}
          </time>
        )}

        {/* Title */}
        <div className="flex-1">
          {titleToUse && (
            <h3 className="text-base font-normal group-hover:translate-x-1 transition-transform">
              <Link href={href} ref={link.ref} className="no-underline hover:underline">
                {titleToUse}
              </Link>
            </h3>
          )}

          {/* Categories - inline */}
          {showCategories && hasCategories && (
            <div className="text-xs text-muted-foreground mt-1">
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled'
                  const isLast = index === categories.length - 1
                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && ' · '}
                    </Fragment>
                  )
                }
                return null
              })}
            </div>
          )}
        </div>
      </div>

      {/* Description - optional, subtle */}
      {description && (
        <p className="text-sm text-muted-foreground mt-2 sm:ml-28 line-clamp-2">
          {description}
        </p>
      )}
    </article>
  )
}
