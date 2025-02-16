import { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import type { Theme, ThemeName } from '@/types/theme'
import { getTheme, getDefaultTheme, isValidTheme, getAvailableThemes } from '@/themes'

const THEME_STORAGE_KEY = 'preferred-theme'

// Get initial theme synchronously to prevent hydration mismatch
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return getDefaultTheme()
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && isValidTheme(stored)) {
      return getTheme(stored)
    }
    
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return getTheme(systemDark ? 'tokyo-night' : 'gruvbox-light')
  } catch {
    return getDefaultTheme()
  }
}

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme)
  const [isLoading, setIsLoading] = useState(false)

  // Get system color scheme preference
  const getSystemTheme = useCallback((): ThemeName => {
    if (typeof window === 'undefined') return 'tokyo-night'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'tokyo-night'
      : 'gruvbox-light'
  }, [])

  // Apply theme to document
  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement
    const { palette } = theme

    // Apply theme variables
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    // Update theme metadata
    root.setAttribute('data-theme', theme.metadata.name)
    root.setAttribute('data-theme-dark', theme.metadata.isDark.toString())
  }, [])

  // Handle theme change
  const setTheme = useCallback((themeName: ThemeName) => {
    const theme = getTheme(themeName)
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, themeName)
  }, [applyTheme])

  // Sync with system preferences
  useLayoutEffect(() => {

    // Apply theme immediately
    applyTheme(currentTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        const newTheme = getTheme(e.matches ? 'tokyo-night' : 'gruvbox-light')
        setCurrentTheme(newTheme)
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [currentTheme])

  return {
    currentTheme,
    setTheme,
    isLoading,
    availableThemes: getAvailableThemes(),
    isDark: currentTheme.metadata.isDark
  }
}
