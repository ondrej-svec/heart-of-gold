import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

const navItems = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ondrejsvec/' },
  { label: 'GitHub', url: 'https://github.com/ondrej-svec' },
]

export async function Footer() {
  return (
    <footer className="mt-auto w-full">
      <div className="max-w-[65ch] mx-auto px-6 py-8">
        <div className="text-muted-foreground text-xs mb-6 opacity-40">
          ────────────────────────────────────────
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1">
            <span>ondrej švec</span>
            <span className="text-xs opacity-60">coach · technologist · cyclist</span>
          </div>
          <div className="flex items-center gap-6">
            <ThemeSelector />
            <nav className="flex gap-4 text-xs">
              {navItems.map(({ label, url }, i) => (
                <Link
                  key={i}
                  href={url}
                  className="hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-6 text-xs text-muted-foreground opacity-40">
          © {new Date().getFullYear()} · made with curiosity
        </div>
      </div>
    </footer>
  )
}
