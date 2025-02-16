# Naming Conventions

## Files and Directories
### Components
- PascalCase: `KeyboardNavigation.tsx`
- One component per file
- Suffix with .tsx

### Utils
- camelCase: `posts.ts`
- Function-focused naming
- Suffix with .ts

### Pages
- kebab-case routes
- [slug] for dynamics
- page.tsx naming

## TypeScript
### Interfaces
- PascalCase
- Suffix with type: `PostProps`
- Explicit over implicit

### Types
- PascalCase
- Descriptive names
- Union types preferred

### Generics
- T prefix: `TData`
- Descriptive: `TPost`
- Constraint when possible

## CSS
### Classes
- kebab-case
- Tailwind utilities
- BEM for custom

### Variables
- kebab-case
- Semantic naming
- Color system prefixes

## Functions
### Components
- handle prefix: `handleClick`
- async prefix: `asyncFetch`
- get prefix: `getData`

### Hooks
- use prefix: `useNavigation`
- Verb-based naming
- Boolean returns: `isLoading`

## Constants
### Environment
- SCREAMING_SNAKE_CASE
- Prefix with process
- Type safe

### Config
- PascalCase
- Domain prefixes
- Grouped exports

## Context
### Providers
- Suffix with Provider
- Prefix with domain
- State isolation

### Consumers
- use prefix
- Domain specific
- Clear purpose
