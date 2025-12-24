import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="max-w-[65ch] mx-auto px-6 py-24">
      <h1 className="text-4xl font-normal mb-2 rotate-messy">404</h1>
      <p className="text-muted-foreground mb-8">
        this page wandered off somewhere. it happens.
      </p>
      <Link href="/" className="text-sm">
        ← go home
      </Link>
    </div>
  )
}
