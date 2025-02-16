# Terminus API Documentation

## Installation

```bash
npm install terminus-blog-engine
```

## Quick Start

```tsx
import { ThemeProvider, MarkdownRenderer, KeyboardNavigation } from 'terminus-blog-engine';

function App() {
  return (
    <ThemeProvider>
      <KeyboardNavigation navigationItems={[/* your navigation items */]}>
        <MarkdownRenderer content="# Your markdown content" />
      </KeyboardNavigation>
    </ThemeProvider>
  );
}
```

## Components

### MarkdownRenderer

A GPU-accelerated markdown renderer with syntax highlighting and Vim-like navigation.

```tsx
import { MarkdownRenderer } from 'terminus-blog-engine';

<MarkdownRenderer 
  content="# Your markdown content"
  // Additional props are passed to react-markdown
/>
```

### ThemeProvider

Provides theme context and management for the application.

```tsx
import { ThemeProvider } from 'terminus-blog-engine';

<ThemeProvider>
  {/* Your app content */}
</ThemeProvider>
```

### KeyboardNavigation

Adds Vim-style keyboard navigation to any component.

```tsx
import { KeyboardNavigation } from 'terminus-blog-engine';

<KeyboardNavigation
  navigationItems={[
    { id: '1', href: '/page1', label: 'Page 1' },
    { id: '2', href: '/page2', label: 'Page 2' },
  ]}
>
  <YourComponent />
</KeyboardNavigation>
```

## Hooks

### useTheme

```tsx
import { useTheme } from 'terminus-blog-engine';

function ThemeSwitcher() {
  const { currentTheme, setTheme, isDark, availableThemes } = useTheme();
  
  return (
    <select 
      value={currentTheme.metadata.name}
      onChange={(e) => setTheme(e.target.value as ThemeName)}
    >
      {availableThemes.map(theme => (
        <option key={theme.name} value={theme.name}>
          {theme.displayName}
        </option>
      ))}
    </select>
  );
}
```

## Theme System

### Theme Types

```typescript
type ThemeName = 'tokyo-night' | 'gruvbox-dark' | 'gruvbox-light' | 'one-dark';

interface ThemePalette {
  // Base colors
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  
  // UI colors
  border: string;
  comment: string;
  link: string;
  
  // Syntax colors
  keyword: string;
  string: string;
  function: string;
  variable: string;
  constant: string;
  type: string;
  class: string;
  number: string;
  operator: string;
  
  // Terminal colors
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

interface ThemeMetadata {
  name: ThemeName;
  displayName: string;
  author: string;
  description?: string;
  isDark: boolean;
}

interface Theme {
  metadata: ThemeMetadata;
  palette: ThemePalette;
}
```

## Blog Types

### Post Interface

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  publishDate?: string;  // ISO date string for scheduled publishing
  content: string;
  description: string;
  draft: boolean;
  excerpt?: string;
  tags?: string[];
  series?: SeriesData;
}

interface SeriesData {
  name: string;
  order: number;
  totalParts?: number;
}
```

### Navigation Types

```typescript
interface NavigationState {
  currentIndex: number;
  items: Array<{
    id: string;
    href: string;
    label: string;
  }>;
}

interface KeyboardNavigationProps {
  children: React.ReactElement<{
    className?: string;
  }>;
  navigationItems: NavigationState['items'];
}
```

## Context Providers

### PostContext

Provides post management and navigation state.

```tsx
import { PostProvider, PostContext } from 'terminus-blog-engine';

function BlogLayout() {
  return (
    <PostProvider>
      {/* Your blog components */}
    </PostProvider>
  );
}

// Using the context
function BlogPost() {
  const { currentPost, navigation } = useContext(PostContext);
  return (
    // Your post rendering logic
  );
}
```

## Advanced Usage

### Custom Theme Creation

```typescript
import { Theme, ThemeName } from 'terminus-blog-engine';

const customTheme: Theme = {
  metadata: {
    name: 'custom-theme' as ThemeName,
    displayName: 'Custom Theme',
    author: 'Your Name',
    isDark: true,
  },
  palette: {
    // Your custom color palette
    background: '#1a1b26',
    foreground: '#a9b1d6',
    // ... rest of the palette
  }
};

// Use with ThemeProvider
<ThemeProvider initialTheme={customTheme}>
  {/* Your app */}
</ThemeProvider>
```

### Series Management

```typescript
import { Series, Post } from 'terminus-blog-engine';

const series: Series = {
  name: "Getting Started with Terminus",
  posts: [
    {
      id: "1",
      title: "Part 1: Installation",
      // ... other post properties
      series: {
        name: "Getting Started with Terminus",
        order: 1,
        totalParts: 3
      }
    },
    // ... other posts in the series
  ]
};
```

## Performance Considerations

- The MarkdownRenderer component uses WebGL/WebGPU for text rendering when available
- Theme switching is optimized for zero hydration errors
- Navigation state is managed with performance in mind
- All components are optimized for edge runtime

## Accessibility

All components are built with accessibility in mind:
- ARIA labels and roles are properly implemented
- Keyboard navigation follows WCAG guidelines
- Color contrast meets AA standards
- Screen reader optimizations are in place
- Reduced motion preferences are respected
