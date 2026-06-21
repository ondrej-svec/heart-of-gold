import React from 'react'

import { SubscribeForm } from './SubscribeForm.client'

/**
 * Gated newsletter signup. Renders nothing unless
 * `NEXT_PUBLIC_NEWSLETTER_ENABLED=1` — the soft-launch switch. This keeps the
 * surface clean until Neon/Resend are provisioned and the form is ready to show.
 */
export function Newsletter({ className }: { className?: string }) {
  if (process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED !== '1') return null
  return <SubscribeForm className={className} />
}
