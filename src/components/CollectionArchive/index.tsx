import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className="max-w-[65ch] mx-auto px-6">
      <div className="divide-y divide-foreground/10">
        {posts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <Card key={index} doc={result} relationTo="posts" showCategories />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
