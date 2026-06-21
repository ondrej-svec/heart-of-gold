'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type Status = 'idle' | 'submitting' | 'done' | 'error'

export function SubscribeForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  // Honeypot: real users never fill this; bots usually do.
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (website) return // honeypot tripped — silently no-op
    if (!consent) {
      setStatus('error')
      setMessage('please tick the box so I know it’s okay to email you.')
      return
    }
    setStatus('submitting')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      if (res.ok) {
        setStatus('done')
        setMessage(data.message || 'check your inbox to confirm.')
      } else {
        setStatus('error')
        setMessage(data.message || 'something went wrong. please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('something went wrong. please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className={cn('rounded border border-border bg-card px-5 py-4 font-mono text-sm', className)}>
        <p className="text-foreground">{message}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('rounded border border-border bg-card px-5 py-5 font-mono', className)}
      noValidate
    >
      <p className="mb-1 text-sm lowercase tracking-wide text-foreground">get new posts by email</p>
      <p className="mb-4 text-xs text-muted-foreground">
        no spam, no list-selling. just new writing when it lands. unsubscribe in one click.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 flex-1 rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="email address"
        />
        <Button type="submit" disabled={status === 'submitting'} size="default">
          {status === 'submitting' ? 'subscribing…' : 'subscribe'}
        </Button>
      </div>

      {/* Honeypot — visually hidden, off the tab order. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-label="leave-empty">
        <label>
          website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span>
          i agree to receive new blog posts by email and understand i can unsubscribe at any time. see
          the{' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            privacy policy
          </a>
          .
        </span>
      </label>

      {status === 'error' && message && (
        <p className="mt-3 text-xs text-destructive" role="alert">
          {message}
        </p>
      )}
    </form>
  )
}
