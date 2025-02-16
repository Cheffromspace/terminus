'use client';

import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import type { ThemeContextValue, ThemeName, Theme } from '../types/theme';
import { tokyoNight, gruvboxDark, gruvboxLight, oneDark } from '../themes';
import styles from '../styles/theme.module.css';

const themes: Record<ThemeName, Theme> = {
  'tokyo-night': tokyoNight,
  'gruvbox-dark': gruvboxDark,
  'gruvbox-light': gruvboxLight,
  'one-dark': oneDark
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return tokyoNight;

  try {
    const stored = localStorage.getItem('preferred-theme') as ThemeName;
    if (stored && stored in themes) return themes[stored];

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemDark ? tokyoNight : gruvboxLight;
  } catch {
    return tokyoNight;
  }
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme.metadata.name);
  Object.entries(theme.palette).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
    // Also set the theme- prefixed version for backward compatibility
    root.style.setProperty(`--theme-${key}`, value);
  });
};

// Create theme context
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Custom hook to use theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeProvider({
  children
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Apply theme on mount and handle system preference changes
  useLayoutEffect(() => {
    applyTheme(currentTheme);
    setIsInitialized(true);
    // Add theme-loaded class after initialization
    document.documentElement.classList.add('theme-loaded');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('preferred-theme')) {
        const newTheme = e.matches ? tokyoNight : gruvboxLight;
        setCurrentTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  const setTheme = (themeName: ThemeName) => {
    const newTheme = themes[themeName];
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('preferred-theme', themeName);
  };

  if (!isInitialized) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        isDark: currentTheme.metadata.isDark,
        availableThemes: Object.values(themes).map(theme => theme.metadata)
      }}
    >
      <>
        {children}
        <div className={styles.themeSelector}>
          <div className={styles.themePreview} style={{ backgroundColor: currentTheme.palette.background }} />
          <select
            value={currentTheme.metadata.name}
            onChange={(e) => setTheme(e.target.value as ThemeName)}
            className={styles.themeSelect}
            aria-label="Select theme"
          >
            {Object.values(themes).map((theme: Theme) => (
              <option key={theme.metadata.name} value={theme.metadata.name}>
                {theme.metadata.displayName}
              </option>
            ))}
          </select>
        </div>
      </>
    </ThemeContext.Provider>
  );
}
