import type { AudioBlock as AudioBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'

type Props = AudioBlockProps & {
  className?: string
}

export const AudioBlock: React.FC<Props> = ({ audio, title, className }) => {
  if (!audio || typeof audio !== 'object') return null

  const src = audio.url

  return (
    <div className={cn('my-8', className)}>
      {title && <p className="mb-3 text-sm font-medium text-muted-foreground">{title}</p>}
      <audio controls preload="metadata" className="w-full">
        <source src={src ?? undefined} type={audio.mimeType ?? 'audio/mpeg'} />
      </audio>
    </div>
  )
}
