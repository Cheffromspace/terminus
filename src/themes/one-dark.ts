import type { Theme } from '@/types/theme'

export const oneDark: Theme = {
  metadata: {
    name: 'one-dark',
    displayName: 'One Dark',
    author: 'Atom',
    description: 'A dark theme based on Atom\'s iconic One Dark theme',
    isDark: true
  },
  palette: {
    // Base colors
    background: '#282c34',
    backgroundMuted: '#2c313a',
    foreground: '#abb2bf',
    cursor: '#528bff',
    selection: '#3e4451',
    
    // UI colors
    border: '#181a1f',
    comment: '#5c6370',
    link: '#61afef',
    
    // Syntax colors
    keyword: '#c678dd',
    string: '#98c379',
    function: '#61afef',
    variable: '#e06c75',
    constant: '#d19a66',
    type: '#56b6c2',
    class: '#e5c07b',
    number: '#d19a66',
    operator: '#56b6c2',
    
    // Terminal colors
    black: '#282c34',
    red: '#e06c75',
    green: '#98c379',
    yellow: '#e5c07b',
    blue: '#61afef',
    magenta: '#c678dd',
    cyan: '#56b6c2',
    white: '#abb2bf',
    brightBlack: '#5c6370',
    brightRed: '#be5046',
    brightGreen: '#98c379',
    brightYellow: '#d19a66',
    brightBlue: '#61afef',
    brightMagenta: '#c678dd',
    brightCyan: '#56b6c2',
    brightWhite: '#ffffff'
  }
}
