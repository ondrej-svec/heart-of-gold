'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(null) // Use default theme
  })

  return (
    <div className="max-w-[65ch] mx-auto px-6 pt-16 pb-12">
      <div className="prose-mono">
        {richText && (
          <div className="rotate-slight-left">
            <RichText data={richText} enableGutter={false} />
          </div>
        )}
        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-6 mt-8 list-none p-0">
            {links.map(({ link }, i) => {
              return (
                <li key={i} className="p-0">
                  <CMSLink {...link} className="text-sm" />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
