# Code Structure

## Directory Layout
```
/
├── content/        # Version controlled test content
│   └── posts/     # Test blog posts and examples
├── local/         # Local development content (git-ignored)
│   └── content/   # Local blog posts and assets
│       └── posts/ # Production blog content
└── src/           # Application source code
    ├── app/       # Next.js App Router
    ├── components/# React components
    ├── contexts/  # React contexts
    ├── types/     # TypeScript types
    └── utils/     # Helper functions
```

## Content Organization
### Test Content
- `/content/posts/`: Version controlled test content
  - Example posts
  - Development fixtures
  - Testing scenarios

### Local Content
- `/local/content/posts/`: Git-ignored local content
  - Production blog posts
  - Personal content
  - Environment-specific assets

### Content Loading
```typescript
// Environment-based content path
const POSTS_DIRECTORY = process.env.BLOG_CONTENT_DIR 
  ? path.join(process.cwd(), process.env.BLOG_CONTENT_DIR)
  : path.join(process.cwd(), 'content', 'posts');
```

## Component Organization
### Atomic Design
- atoms/       # Basic UI elements
- molecules/   # Component combinations
- organisms/   # Complex components
- templates/   # Page layouts

### Component Structure
```typescript
// Imports
import type { FC } from 'react'
import type { Props } from './types'

// Hooks/Constants
const useCustomHook = () => {...}
const CONSTANTS = {...}

// Component
export const Component: FC<Props> = () => {...}

// Exports
export default Component
```

## State Management
### Context Pattern
```typescript
const Context = createContext<State>(initial)
const Provider: FC = ({children}) => {
  const state = useState<State>(initial)
  return <Context.Provider value={state}>
    {children}
  </Context.Provider>
}
```

## Performance Patterns
### Code Splitting
- Dynamic imports
- Route-based splitting
- Component lazy loading

### Render Optimization
- Server components
- Selective hydration
- Streaming SSR

## Testing Structure
### Unit Tests
- Component tests
- Utility tests
- Hook tests

### Integration Tests
- Page tests
- API tests
- E2E flows

## Build Pipeline
### Development
- Turbopack
- TypeScript
- ESLint

### Production
- Minification
- Tree shaking
- Code splitting

## Documentation
### Components
- Props interface
- Usage examples
- Performance notes

### Utils
- Function signatures
- Return types
- Side effects

## Error Handling
### Boundaries
- Page level
- Component level
- API level

### Logging
- Error tracking
- Performance metrics
- User interactions
