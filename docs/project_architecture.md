# Project Architecture

## Core Stack
- Next.js 14 App Router
- React Server Components
- Edge Runtime
- WebGL/WebGPU

## Performance Layer
### GPU Acceleration
- WebGL text rendering pipeline
- SDF (Signed Distance Field) fonts
- Shader-based text rasterization
- Hardware acceleration fallbacks

### Edge Optimization
- Static page generation
- Dynamic islands
- Streaming SSR
- Route prefetching

## Component Architecture
### Layout System
- RootLayout: Theme/Post providers
- ClientSidebar: Dynamic navigation
- MarkdownRenderer: Content display

### State Management
- PostContext: Content state
- ThemeProvider: UI preferences
- NavigationState: Vim positions

## Navigation System
### Vim Implementation
- KeyboardNavigation component
- Custom hooks for key bindings
- Scroll management
- Focus tracking

### Routing Strategy
- App directory structure
- Dynamic routes ([slug])
- API routes optimization
- Middleware functions

## Content Pipeline
### Content Organization
- Separated test and production content
  - Test content in version control
  - Local content git-ignored
- Environment-based content loading
  - BLOG_CONTENT_DIR configuration
  - Development/production path switching
- Content isolation principles
  - No hard-coded content
  - Environment-specific loading
  - Clean separation of concerns

### Post Processing
- MDX compilation
- Syntax highlighting
- Mermaid diagrams
- Code block optimization

### Data Flow
- Static generation
- Incremental builds
- Content indexing
- Search optimization
- Environment-aware loading
  - Development: test content
  - Production: local content
  - Fallback mechanisms

## Performance Monitoring
- Core Web Vitals
- Memory profiling
- GPU metrics
- Hydration tracking
