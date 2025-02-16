import type { Theme } from '@/types/theme'

export const tokyoNight: Theme = {
  metadata: {
    name: 'tokyo-night',
    displayName: 'Tokyo Night',
    author: 'Enkia',
    description: 'A dark and modern theme inspired by the lights of Downtown Tokyo at night',
    isDark: true
  },
  palette: {
    // Base colors
    background: '#1a1b26',
    foreground: '#a9b1d6',
    cursor: '#c0caf5',
    selection: '#33467c',
    
    // UI colors
    border: '#15161e',
    comment: '#565f89',
    link: '#7aa2f7',
    
    // Syntax colors
    keyword: '#9d7cd8',
    string: '#9ece6a',
    function: '#7aa2f7',
    variable: '#bb9af7',
    constant: '#ff9e64',
    type: '#2ac3de',
    class: '#7dcfff',
    number: '#ff9e64',
    operator: '#89ddff',
    
    // Terminal colors
    black: '#15161e',
    red: '#f7768e',
    green: '#9ece6a',
    yellow: '#e0af68',
    blue: '#7aa2f7',
    magenta: '#bb9af7',
    cyan: '#7dcfff',
    white: '#a9b1d6',
    brightBlack: '#414868',
    brightRed: '#f7768e',
    brightGreen: '#9ece6a',
    brightYellow: '#e0af68',
    brightBlue: '#7aa2f7',
    brightMagenta: '#bb9af7',
    brightCyan: '#7dcfff',
    brightWhite: '#c0caf5'
  }
}
