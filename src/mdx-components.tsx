import type { MDXComponents } from 'mdx/types'
import React from 'react'

import { Code } from '@/blocks/Code/Component.client'
import { cn } from '@/utilities/ui'

// --- AudioBlock ---

function AudioBlock({ src, title }: { src: string; title?: string }) {
  if (!src) return null
  return (
    <div className="my-8">
      {title && <p className="mb-3 text-sm font-medium text-muted-foreground">{title}</p>}
      <audio controls preload="metadata" className="w-full">
        <source src={src} type="audio/mpeg" />
      </audio>
    </div>
  )
}

// --- Banner ---

function Banner({
  style = 'info',
  children,
}: {
  style?: 'info' | 'warning' | 'error' | 'success'
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto my-8 w-full">
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border bg-card': style === 'info',
          'border-error bg-error/30': style === 'error',
          'border-success bg-success/30': style === 'success',
          'border-warning bg-warning/30': style === 'warning',
        })}
      >
        {children}
      </div>
    </div>
  )
}

// --- MDX component overrides ---

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    AudioBlock,
    Banner,
    // Keep existing code block rendering via prism
    pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) => {
      // If the child is a <code> element with a language class, use prism
      const child = React.Children.only(children) as React.ReactElement<{
        className?: string
        children?: string
      }>
      if (child?.props?.className?.startsWith('language-')) {
        const language = child.props.className.replace('language-', '')
        const code = typeof child.props.children === 'string' ? child.props.children.trim() : ''
        return (
          <div className="not-prose">
            <Code code={code} language={language} />
          </div>
        )
      }
      return <pre {...props}>{children}</pre>
    },
  }
}
