# Terminus

A hyper-fast, GPU-accelerated blog engine with Vim-like navigation and zero-compromise accessibility.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Mission

Terminus pushes the boundaries of web performance while maintaining exceptional accessibility. Built with WebGL/WebGPU acceleration, edge optimization, and Vim-inspired navigation, it delivers sub-5ms page loads and fluid interactions without sacrificing usability or accessibility.

## Key Features

- 🚀 **GPU-Accelerated Text Rendering**
  - WebGL/WebGPU text pipeline
  - SDF (Signed Distance Field) fonts
  - Hardware acceleration fallbacks

- ⌨️ **Vim-Style Navigation**
  - Fluid keyboard controls
  - Seamless scroll management
  - Focus tracking

- ♿ **Zero-Compromise Accessibility**
  - ARIA-first development
  - Screen reader optimization
  - Reduced motion support

- 🎨 **Terminal-Inspired Themes**
  - Popular Linux themes (Tokyo Night, Gruvbox, One Dark)
  - Zero hydration errors
  - System preference detection

## Performance Philosophy

Terminus is built on three core principles:

1. **Edge-First**: Static generation and edge runtime for minimal latency
2. **GPU Acceleration**: Hardware-accelerated text rendering for fluid interactions
3. **Accessibility**: Performance should never compromise usability

## Architecture

```
/
├── content/        # Version controlled test content
├── local/         # Local development content (git-ignored)
└── src/           # Application source code
    ├── app/       # Next.js App Router
    ├── components/# React components
    ├── contexts/  # React contexts
    ├── types/     # TypeScript types
    └── utils/     # Helper functions
```

### Technical Stack
- Next.js 14 App Router
- React Server Components
- Edge Runtime
- WebGL/WebGPU

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/terminus.git
cd terminus
```

2. Install dependencies:
```bash
npm install
```

3. Configure content directory:
```bash
# Create .env.local
echo "BLOG_CONTENT_DIR=local/content/posts" > .env.local
```

4. Start development server:
```bash
npm run dev
```

## Content Management

Content is organized into two directories:
- `/content/posts/`: Version controlled test content
- `/local/content/posts/`: Local blog content (git-ignored)

## Performance Metrics

- Page load: < 5ms
- Theme switch: < 5ms
- Lighthouse score: > 95
- FCP: < 5ms
- TTI: < 100ms
- A11y score: 100

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Code Style

- TypeScript for type safety
- Functional components
- Server-first approach
- Performance-focused patterns

## License

MIT License - see [LICENSE](LICENSE) for details
