# Contributing to Terminus

We're excited to have you help make Terminus more accessible and performant! This guide will help you get started as a contributor.

## Areas We Need Help

### 1. Accessibility Testing
We particularly welcome contributions from:
- Screen reader users
- Keyboard-only users
- Users with motor impairments
- Users who rely on high contrast modes
- Users who require reduced motion
- Users with cognitive disabilities
- Users with other assistive technologies

Your real-world usage and feedback are invaluable for making Terminus truly accessible.

### 2. Performance Monitoring
- Edge case performance testing
- Hardware acceleration testing
- Different device/browser combinations
- Network condition testing

### 3. Code Contributions
- WebGL/WebGPU optimizations
- Accessibility improvements
- Performance enhancements
- Bug fixes

## Getting Started with Accessibility Testing

### Screen Reader Testing
1. Test with multiple screen readers:
   - NVDA (Windows)
   - VoiceOver (macOS)
   - JAWS (Windows)
   - Orca (Linux)

2. Key areas to test:
   - Navigation flow
   - Content readability
   - Interactive elements
   - Dynamic content updates
   - Error messages
   - Keyboard shortcuts

### Keyboard Navigation Testing
1. Verify all features are accessible via keyboard
2. Test Vim-style navigation commands
3. Check focus management
4. Verify skip links
5. Test keyboard traps

### Reduced Motion Testing
1. Enable reduced motion in your OS
2. Verify animations are respectful
3. Check transition alternatives

## Reporting Accessibility Issues

When reporting accessibility issues, please include:

1. Environment Details
   - Assistive technology used
   - Browser and version
   - Operating system
   - Any relevant user settings

2. Issue Description
   - What you were trying to do
   - What you expected to happen
   - What actually happened
   - Steps to reproduce

3. Impact Assessment
   - How this affects users
   - Severity of the issue
   - Number of users potentially affected

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/terminus.git
cd terminus
```

2. Install dependencies:
```bash
npm install
```

3. Create local content directory:
```bash
echo "BLOG_CONTENT_DIR=local/content/posts" > .env.local
```

4. Start development server:
```bash
npm run dev
```

## Pull Request Guidelines

1. Focus on one issue per PR
2. Include before/after accessibility metrics
3. Add tests for new features
4. Update documentation
5. Follow existing code style
6. Include screenshots/videos for UI changes

## Accessibility Standards

We adhere to:
- WCAG 2.1 Level AAA
- WAI-ARIA 1.2
- Section 508
- EN 301 549

## Code Style

- TypeScript for type safety
- Functional components
- ARIA attributes where needed
- Performance-focused patterns
- Comprehensive error handling

## Getting Help

- Join our Discord server
- Check our Wiki
- Tag issues with 'good first issue'
- Ask in Discussions

## Recognition

We value all contributions and recognize contributors through:
- Contributors page on our website
- Release notes mentions
- Community spotlights
- Contributor badges

Thank you for helping make Terminus more accessible!
