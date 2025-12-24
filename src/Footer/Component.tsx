import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto w-full">
      <div className="max-w-[65ch] mx-auto px-6 py-8">
        {/* ASCII divider */}
        <div className="text-muted-foreground text-xs mb-6 opacity-40">
          ────────────────────────────────────────
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1">
            <span>ondrej švec</span>
            <span className="text-xs opacity-60">builder · coach · cyclist</span>
          </div>

          <div className="flex items-center gap-6">
            <ThemeSelector />
            {navItems.length > 0 && (
              <nav className="flex gap-4 text-xs">
                {navItems.map(({ link }, i) => {
                  if (typeof link?.url === 'string') {
                    return (
                      <Link
                        key={i}
                        href={link.url}
                        className="hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )
                  }
                  return null
                })}
              </nav>
            )}
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground opacity-40">
          © {new Date().getFullYear()} · made with curiosity
        </div>
      </div>
    </footer>
  )
}
