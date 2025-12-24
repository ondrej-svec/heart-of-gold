'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'writing', href: '/writing' },
  { label: 'wandering', href: '/wandering' },
  { label: 'about', href: '/about' },
]

export const HeaderNav: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className="flex gap-6 items-center text-sm">
      {NAV_ITEMS.map(({ label, href }) => {
        const isActive = pathname === href || pathname?.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={`transition-all hover-wobble ${
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isActive && '> '}{label}
          </Link>
        )
      })}
    </nav>
  )
}
