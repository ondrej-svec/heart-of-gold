import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, richText }) => {
  return (
    <div className="max-w-[65ch] mx-auto px-6 pt-12 pb-8">
      <div className="prose-mono">
        {richText && <RichText data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-6 mt-6 list-none p-0">
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
