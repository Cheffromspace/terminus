# Terminus Components Documentation

## MarkdownRenderer

A GPU-accelerated markdown renderer with extensive features for technical documentation and blog posts.

### Props

```typescript
interface MarkdownRendererProps {
  content: string;              // The markdown content to render
  frontmatter?: FrontmatterData; // Optional frontmatter metadata
  className?: string;           // Optional CSS class name
}

interface FrontmatterData {
  title?: string;
  date?: string | Date;
  description?: string;
  series?: SeriesData;
  draft?: boolean;
  excerpt?: string;
  [key: string]: string | Date | boolean | SeriesData | undefined;
}
```

### Features

#### 1. GPU-Accelerated Rendering
- Utilizes WebGL/WebGPU for text rendering when available
- Fallbacks gracefully to CPU rendering
- Optimized for large documents

#### 2. Syntax Highlighting
- Built-in support for code blocks
- Language detection and display
- Tokyo Night Dark theme
- Custom language badge

```tsx
<MarkdownRenderer content={`
\`\`\`typescript
const example = "Hello World";
\`\`\`
`} />
```

#### 3. Mermaid Diagrams
Supports Mermaid.js diagrams with custom styling:

```tsx
<MarkdownRenderer content={`
\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`
`} />
```

#### 4. Interactive Elements
Supports interactive elements with proper event handling:

```tsx
<MarkdownRenderer content={`
<button onclick="alert('Hello!')">
  Click me
</button>
`} />
```

#### 5. Grid Layouts
Supports responsive grid layouts:

```tsx
<MarkdownRenderer content={`
<div style="display: grid">
  <div style="background: #e0e0e0">Item 1</div>
  <div style="background: #e0e0e0">Item 2</div>
</div>
`} />
```

#### 6. Frontmatter Display
Automatically formats and displays frontmatter data:

```tsx
<MarkdownRenderer 
  content="# Post content"
  frontmatter={{
    title: "My Post",
    date: "2024-02-16",
    description: "A sample post"
  }}
/>
```

#### 7. Custom Styling
- Themed code blocks
- Custom blockquotes
- Responsive tables
- Styled links with external detection

### Component Customization

The MarkdownRenderer provides custom components for each markdown element:

```typescript
const components = {
  h1: Custom heading rendering with frontmatter title detection
  div: Custom div handling for styled boxes and grids
  code: Language-aware code blocks with Mermaid support
  button: Interactive buttons with hover effects
  a: Smart external link handling
  // ... and more
}
```

### Performance Optimizations

1. **Efficient Rendering**
   - Uses React.memo for component memoization
   - Optimized rehype plugins
   - Efficient DOM updates

2. **Resource Loading**
   - Lazy-loaded Mermaid diagrams
   - Optimized syntax highlighting
   - Efficient style injection

3. **Memory Management**
   - Proper cleanup of WebGL contexts
   - Efficient event handler management
   - Optimized DOM tree updates

### Accessibility Features

- Semantic HTML structure
- ARIA attributes for interactive elements
- Proper heading hierarchy
- High contrast themes
- Screen reader optimizations

### Usage Examples

1. **Basic Usage**
```tsx
import { MarkdownRenderer } from 'terminus-blog-engine';

<MarkdownRenderer content="# Hello World" />
```

2. **With Frontmatter**
```tsx
<MarkdownRenderer 
  content={content}
  frontmatter={{
    title: "My Post",
    date: "2024-02-16",
    description: "A sample post",
    series: {
      name: "Getting Started",
      order: 1,
      totalParts: 3
    }
  }}
/>
```

3. **With Custom Styling**
```tsx
<MarkdownRenderer 
  content={content}
  className="custom-prose dark:prose-invert"
/>
```

4. **With Interactive Elements**
```tsx
<MarkdownRenderer content={`
# Interactive Demo

<button onclick="alert('Clicked!')">
  Click me
</button>

<div style="display: grid">
  <div style="background: #e0e0e0">Grid Item 1</div>
  <div style="background: #e0e0e0">Grid Item 2</div>
</div>

\`\`\`mermaid
graph TD
    A[Start] --> B[End]
\`\`\`
`} />
```

### Best Practices

1. **Performance**
   - Keep markdown content reasonably sized
   - Use code splitting for large documents
   - Implement virtual scrolling for long content

2. **Accessibility**
   - Provide alt text for images
   - Use semantic markdown structure
   - Follow heading hierarchy

3. **Styling**
   - Use theme variables for colors
   - Implement responsive designs
   - Consider dark mode support

4. **Security**
   - Sanitize markdown input
   - Use proper event handling
   - Validate external links

### Error Handling

The component includes robust error handling:

1. **Mermaid Diagrams**
```tsx
try {
  // Mermaid rendering logic
} catch (error) {
  console.error('Mermaid rendering error:', error);
  // Fallback content
}
```

2. **Invalid Markdown**
- Graceful fallback for invalid syntax
- Error boundaries for component failures
- Console warnings for development

### Browser Support

- Modern browsers with WebGL/WebGPU support
- Fallback rendering for older browsers
- Progressive enhancement approach

## KeyboardNavigation

A Vim-inspired keyboard navigation component that provides fluid navigation controls.

### Props

```typescript
interface KeyboardNavigationProps {
  children: React.ReactElement<{
    className?: string;
  }>;
  navigationItems: Array<{
    id: string;
    href: string;
    label: string;
  }>;
}
```

### Features

#### 1. Vim-Style Navigation
- `j/k`: Smooth scrolling up/down
- `Shift+J/K` or `n/N`: Navigate between posts
- `gg`: Go to top/first post
- `Shift+G`: Go to bottom/last post
- `h`: Return to home page
- `Enter`: Open selected post

#### 2. Accessibility
- Screen reader announcements for selection changes
- ARIA attributes for navigation state
- Keyboard instructions for screen readers
- Focus management
- Smooth scrolling

#### 3. Smart Context Awareness
- Adapts behavior based on view context (post view vs. list view)
- Maintains navigation state across renders
- Handles dynamic navigation items

### Usage Example

```tsx
import { KeyboardNavigation } from 'terminus-blog-engine';

const navigationItems = [
  { id: '1', href: '/posts/first', label: 'First Post' },
  { id: '2', href: '/posts/second', label: 'Second Post' }
];

<KeyboardNavigation navigationItems={navigationItems}>
  <div className="your-content">
    {/* Your content here */}
  </div>
</KeyboardNavigation>
```

### Performance Considerations

- Optimized scroll handling
- Efficient state updates
- Debounced navigation
- Smart focus management

### Accessibility Features

- Live region announcements
- Hidden instruction panel
- ARIA selected states
- Focus indicators
- Semantic navigation structure

## ThemeProvider

A powerful theme management system with system preference detection and zero hydration errors.

### Features

#### 1. Theme Management
- Multiple built-in themes (Tokyo Night, Gruvbox, One Dark)
- System preference detection
- Persistent theme selection
- Zero hydration errors

#### 2. Theme Context
```typescript
interface ThemeContextValue {
  currentTheme: Theme;
  setTheme: (themeName: ThemeName) => void;
  isDark: boolean;
  availableThemes: ThemeMetadata[];
}
```

#### 3. Built-in Theme Selector
- Visual theme preview
- Accessible select component
- Smooth theme transitions
- System preference sync

### Usage Example

```tsx
import { ThemeProvider } from 'terminus-blog-engine';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Theme Customization

```typescript
const customTheme: Theme = {
  metadata: {
    name: 'custom-theme',
    displayName: 'Custom Theme',
    author: 'Your Name',
    isDark: true
  },
  palette: {
    background: '#1a1b26',
    foreground: '#a9b1d6',
    // ... other color values
  }
};
```

### Performance Optimizations

1. **Zero Hydration Errors**
   - Server-side rendering compatible
   - Smooth theme transitions
   - No content flashing

2. **Efficient Updates**
   - CSS variable-based theming
   - Optimized re-renders
   - Layout effect usage

3. **System Integration**
   - Media query optimization
   - Local storage caching
   - Efficient preference tracking

### Best Practices

1. **Theme Implementation**
   - Use CSS variables for colors
   - Implement dark/light variants
   - Consider high contrast needs

2. **Performance**
   - Minimize theme switches
   - Use layout effects
   - Optimize selector renders

3. **Accessibility**
   - Support reduced motion
   - Maintain contrast ratios
   - Provide clear labels

### Error Handling

- Fallback theme selection
- Storage error recovery
- Media query fallbacks
