import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span className={clsx('text-base font-normal tracking-tight no-underline', className)}>
      ondrej švec
      <span className="block text-[10px] tracking-[0.2em] opacity-50 -mt-1">~~~~~~~~~~~~</span>
    </span>
  )
}
