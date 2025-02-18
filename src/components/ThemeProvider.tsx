'use client';

import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import type { ThemeContextValue, ThemeName, Theme, ThemePalette } from '../types/theme';
import { tokyoNight, gruvboxDark, gruvboxLight, oneDark } from '../themes';
import styles from '../styles/theme.module.css';

const themes: Record<ThemeName, Theme> = {
  'tokyo-night': tokyoNight,
  'gruvbox-dark': gruvboxDark,
  'gruvbox-light': gruvboxLight,
  'one-dark': oneDark
};

const getInitialTheme = (): Theme => {
  // Always return tokyo-night for initial SSR to prevent hydration mismatch
  return tokyoNight;
};

const getClientTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('preferred-theme') as ThemeName;
    if (stored && stored in themes) return themes[stored];

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemDark ? tokyoNight : gruvboxLight;
  } catch {
    return tokyoNight;
  }
};

// Define critical color keys
type CriticalColorKey = 'background' | 'foreground' | 'link';
const criticalColors: CriticalColorKey[] = ['background', 'foreground', 'link'];

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  // Set loading state
  root.setAttribute('data-theme-loading', 'true');
  
  // Apply critical colors immediately
  criticalColors.forEach(key => {
    const value = theme.palette[key];
      root.style.setProperty(`--${String(key)}`, value);
      root.style.setProperty(`--theme-${String(key)}`, value);
  });

  // Apply remaining theme properties
  (Object.entries(theme.palette) as [keyof ThemePalette, string][]).forEach(([key, value]) => {
    if (!criticalColors.includes(key as CriticalColorKey)) {
      root.style.setProperty(`--${key}`, value);
      root.style.setProperty(`--theme-${key}`, value);
    }
  });

  // Update theme name and remove loading state
  root.setAttribute('data-theme', theme.metadata.name);
  root.removeAttribute('data-theme-loading');
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

  // Initialize theme and handle system preference changes
  useLayoutEffect(() => {
    // First apply the client's preferred theme
    const clientTheme = getClientTheme();
    if (clientTheme.metadata.name !== currentTheme.metadata.name) {
      setCurrentTheme(clientTheme);
      applyTheme(clientTheme);
    } else {
      applyTheme(currentTheme);
    }
    
    setIsInitialized(true);
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
  }, []);

  const setTheme = (themeName: ThemeName) => {
    const newTheme = themes[themeName];
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('preferred-theme', themeName);
  };

  if (!isInitialized) {
    // Apply critical theme variables inline for immediate effect
    const criticalStyle = {
      visibility: 'hidden',
      '--background': currentTheme.palette.background,
      '--foreground': currentTheme.palette.foreground,
      '--link': currentTheme.palette.link,
    } as React.CSSProperties;
    
    return <div style={criticalStyle}>{children}</div>;
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
      <div className={styles.theme}>
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
      </div>
    </ThemeContext.Provider>
  );
}
