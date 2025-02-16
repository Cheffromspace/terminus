# Theme System Implementation Task

## Objective
Implement a high-performance theme system for the Next.js blog with zero flickering and sub-5ms theme switching.

## Context
Working in `/home/jonflatt/source/blog/nextjs-blog` with Next.js 14 App Router.

## Key Files to Create/Modify
1. `src/contexts/ThemeContext.tsx`
   - Follow naming: PascalCase for Context/Provider
   - Use type-safe theme variables
   - Implement React.createContext pattern

2. `src/types/theme.ts`
   - Define interfaces with PascalCase
   - Use explicit typing for theme values
   - Include color system types

3. `src/hooks/useTheme.ts`
   - Follow `use` prefix convention
   - Include type-safe return values
   - Handle theme persistence

4. `src/styles/theme.css`
   - Use kebab-case for variables
   - Follow Tailwind patterns
   - Include transition classes

## Implementation Requirements
1. Theme Provider
   - Zero hydration errors
   - Sub-5ms theme switching
   - SSR compatibility
   - Proper type safety

2. Theme Variables
   - Color system
   - Typography scale
   - Spacing units
   - Transition timings

3. Performance Optimizations
   - Use CSS Variables
   - Implement transition buffering
   - Avoid FOUC (Flash of Unstyled Content)
   - Minimize repaints

4. Integration Points
   - Root layout integration
   - Component theme hooks
   - Media query syncing
   - System preference detection

## Success Metrics
- Theme switch completes in < 5ms
- Zero theme flickering
- 100% type coverage
- Clean hydration
