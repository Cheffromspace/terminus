# Performance Optimization Plan

## Current Performance Analysis

### Bottlenecks Identified
- Post cache initialization overhead
- Runtime matter.js parsing
- React hydration cost
- Client-side JavaScript execution
- Text rendering performance

### Build-time Optimizations
- Markdown pre-rendering:
  * Convert markdown to HTML at build time
  * Pre-compute syntax highlighting
  * Generate static content metadata
  * Optimize HTML output
- Single font strategy:
  * Use system font stack with single fallback
  * Optimize font loading with display: swap
  * Implement font preloading

### Target Metrics
- First Paint: < 1ms
- Time to Interactive: < 100ms
- Lighthouse Performance Score: > 95

## Implementation Plan

### Phase 1: Build-Time Optimizations

#### 1. Post Compilation
- [x] Move post compilation entirely to build time
  - ✓ Create build script to pre-compile all posts
  - ✓ Generate static JSON for post metadata
  - ✓ Pre-compute series relationships
  - ✓ Remove runtime matter.js parsing

#### 2. Asset Optimization
- [x] Implement text-focused optimization
  - ✓ Configure Next.js automatic static optimization for text content
  - ✓ Enable aggressive text compression with minimal chunks (10-30KB)
  - ✓ Implement strict bundle size budgets
  - ✓ Set up immutable caching for text assets

#### 3. CSS Optimization
- [x] Optimize CSS delivery
  - ✓ Extract and inline critical CSS (moved to base layer)
  - ✓ Defer non-critical styles (components and markdown layers)
  - ✓ Implement CSS code splitting (critical, components, markdown)
  - ✓ Remove unused CSS (via layer system and containment)
  
Implementation details:
- CSS is split into three layers:
  1. Base layer (critical.css): Core variables, layout, and theme transitions
  2. Components layer (components.css): UI elements and animations
  3. Markdown layer (markdown.css): Content styling
- Optimizations:
  - CSS containment applied to components
  - Theme transitions optimized to prevent flash
  - Layer system ensures proper cascade
  - Build-time CSS processing via copy-styles.ts

### Phase 2: Runtime Optimizations (Next)

#### 1. JavaScript Optimization
- [ ] Implement progressive hydration
  - Identify critical components
  - Set up partial hydration boundaries
  - Defer non-interactive component hydration
  - Implement lazy loading for non-critical components

#### 2. Caching Strategy
- [ ] Enhance caching implementation
  - Configure edge caching rules
  - Implement stale-while-revalidate
  - Set up cache warming
  - Define cache invalidation strategy

#### 3. Route Optimization
- [ ] Optimize route performance
  - Pre-generate static paths
  - Implement intelligent prefetching
  - Optimize dynamic imports
  - Remove unnecessary redirects

### Phase 3: Monitoring & Validation

#### 1. Performance Monitoring
- [ ] Set up monitoring tools
  - Implement Core Web Vitals tracking
  - Set up real user monitoring
  - Configure performance budgets
  - Create performance dashboards

#### 2. Validation
- [ ] Implement validation checks
  - Create performance regression tests
  - Set up automated lighthouse testing
  - Implement size limit checks
  - Create performance benchmarks

## Technical Implementation Details

### Build-time Pre-rendering
```typescript
// scripts/build-content.js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

async function preRenderContent() {
  const posts = await getAllPosts();
  
  // Pre-render markdown and optimize
  const optimizedPosts = await Promise.all(posts.map(async post => {
    // Pre-render markdown to HTML
    const html = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(post.content);

    // Extract metadata and generate indices
    const metadata = {
      wordCount: post.content.split(/\s+/).length,
      readingTime: Math.ceil(post.content.split(/\s+/).length / 200),
      headings: extractHeadings(post.content),
      codeBlocks: extractCodeBlocks(post.content)
    };

    return {
      ...post,
      preRenderedHtml: String(html),
      metadata,
      // Pre-compute series data if part of a series
      seriesData: post.series ? await computeSeriesData(post.series) : null
    };
  }));

  // Write optimized content to static files
  await Promise.all(optimizedPosts.map(async post => {
    await writeFile(
      `./public/content/${post.slug}.json`,
      JSON.stringify({
        html: post.preRenderedHtml,
        metadata: post.metadata,
        seriesData: post.seriesData
      })
    );
  }));

  // Generate content manifest
  const manifest = generateContentManifest(optimizedPosts);
  await writeFile('./public/content/manifest.json', JSON.stringify(manifest));
}

// Run during build
preRenderContent().catch(console.error);
```

### Static Asset Generation
```typescript
// next.config.ts
import { withContentManifest } from './scripts/with-content-manifest';

const config = withContentManifest({
  output: 'export',
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-markdown']
  },
  webpack: (config) => {
    config.optimization.splitChunks.cacheGroups.content = {
      test: /[\\/]content[\\/]/,
      name: 'content',
      chunks: 'all',
      enforce: true
    };
    return config;
  }
});

export default config;
```

## Validation Metrics

### Performance Targets
- First Paint: < 1ms
- First Contentful Paint: < 5ms
- Time to Interactive: < 100ms
- Largest Contentful Paint: < 10ms
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 50ms

### Size Budgets
- Total JavaScript: < 50KB (compressed)
- Critical CSS: < 10KB
- Initial HTML: < 20KB
- Font: Single WOFF2 file < 30KB
- Markdown Assets: < 30KB per post

## Rollout Strategy

1. Development Phase
   - Implement build-time optimizations
   - Set up monitoring
   - Create performance tests

2. Staging Deployment
   - Validate optimizations
   - Run performance benchmarks
   - Test edge cases

3. Production Release
   - Gradual rollout
   - Monitor metrics
   - Gather user feedback

## Success Criteria

- Achieved sub-millisecond First Paint
- Maintained feature parity
- No regression in accessibility
- Improved Core Web Vitals
- Enhanced user experience metrics

## Text-Specific Optimizations

### Immediate Optimizations
- Pre-render all text content at build time
- Implement text-specific compression (e.g., GZIP with optimal settings for text)
- Use single variable font for all text display
- Implement virtual scrolling for long content
- Pre-compute text layout calculations

### Advanced Techniques
- Build-time optimizations:
  * Pre-render all markdown to HTML
  * Extract and inline critical styles
  * Pre-compute syntax highlighting
  * Generate content metadata
  * Optimize static assets
- Performance features:
  * Virtual scrolling for long content
  * Content chunking
  * Edge caching
  * Route prefetching
