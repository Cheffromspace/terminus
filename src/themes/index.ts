import type { Theme, ThemeName } from '../types/theme';
import { tokyoNight } from './tokyo-night';
import { gruvboxDark, gruvboxLight } from './gruvbox';
import { oneDark } from './one-dark';

// Theme registry
const themes: Record<ThemeName, Theme> = {
  'tokyo-night': tokyoNight,
  'gruvbox-dark': gruvboxDark,
  'gruvbox-light': gruvboxLight,
  'one-dark': oneDark
};

export const getTheme = (name: ThemeName): Theme => {
  if (!(name in themes)) {
    console.warn(`Theme "${name}" not found, falling back to Tokyo Night`);
    return themes['tokyo-night'];
  }
  return themes[name];
};

export const getAvailableThemes = () => {
  return Object.values(themes).map(theme => theme.metadata);
};

export const getDefaultTheme = (): Theme => {
  return themes['tokyo-night'];
};

// Helper to determine if a theme name exists
export const isValidTheme = (name: string): name is ThemeName => {
  return name in themes;
};

// Export individual themes
export {
  tokyoNight,
  gruvboxDark,
  gruvboxLight,
  oneDark
};
