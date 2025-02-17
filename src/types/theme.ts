export type ThemeName = 'tokyo-night' | 'gruvbox-dark' | 'gruvbox-light' | 'one-dark'

export interface ThemePalette {
  // Base colors
  background: string
  backgroundMuted: string
  foreground: string
  cursor: string
  selection: string
  
  // UI colors
  border: string
  comment: string
  link: string
  
  // Syntax colors
  keyword: string
  string: string
  function: string
  variable: string
  constant: string
  type: string
  class: string
  number: string
  operator: string
  
  // Terminal colors
  black: string
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  white: string
  brightBlack: string
  brightRed: string
  brightGreen: string
  brightYellow: string
  brightBlue: string
  brightMagenta: string
  brightCyan: string
  brightWhite: string
}

export interface ThemeMetadata {
  name: ThemeName
  displayName: string
  author: string
  description?: string
  isDark: boolean
}

export interface Theme {
  metadata: ThemeMetadata
  palette: ThemePalette
}

export interface ThemeContextValue {
  currentTheme: Theme
  setTheme: (themeName: ThemeName) => void
  isDark: boolean
  availableThemes: ThemeMetadata[]
}
