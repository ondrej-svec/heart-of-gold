import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  return (
    <div className="max-w-[65ch] mx-auto px-6 my-12">
      {columns &&
        columns.length > 0 &&
        columns.map((col, index) => {
          const { enableLink, link, richText, size } = col

          // For single column (full width), use prose styling
          const isFull = size === 'full' || columns.length === 1

          return (
            <div
              className={isFull ? 'prose-mono' : 'mb-8'}
              key={index}
            >
              {richText && <RichText data={richText} enableGutter={false} />}
              {enableLink && <CMSLink {...link} className="text-sm mt-4 inline-block" />}
            </div>
          )
        })}
    </div>
  )
}
