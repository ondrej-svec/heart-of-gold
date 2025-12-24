'use client'

import React, { useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState<string>('')

  const onThemeChange = () => {
    // Cycle through: light -> dark -> auto -> light
    let next: Theme | null
    if (value === 'light') {
      next = 'dark'
      setValue('dark')
    } else if (value === 'dark') {
      next = null
      setValue('auto')
    } else {
      next = 'light'
      setValue('light')
    }
    setTheme(next)
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  const label = value === 'dark' ? '◐' : value === 'light' ? '○' : '◑'
  const title = value === 'dark' ? 'dark mode' : value === 'light' ? 'light mode' : 'auto mode'

  return (
    <button
      onClick={onThemeChange}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
      title={title}
    >
      [{label}]
    </button>
  )
}
