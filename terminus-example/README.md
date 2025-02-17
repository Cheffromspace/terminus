# Terminus Blog Example

This is an example implementation of the Terminus blog engine, demonstrating its key features including GPU-accelerated rendering, Vim-like navigation, and excellent accessibility.

## Features

- GPU-accelerated text rendering
- Vim-like keyboard navigation
- Multiple built-in themes
- Markdown support with syntax highlighting
- Zero-compromise accessibility
- Fast page loads

## Getting Started

1. Clone this repository:
```bash
git clone [your-repo-url]
cd terminus-example
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Adding Content

1. Create new posts in the `content/posts` directory using Markdown:
```markdown
---
title: Your Post Title
date: YYYY-MM-DD
description: Brief description of your post
---

Your content here...
```

2. Posts will automatically appear in the blog listing.

## Keyboard Navigation

The blog supports Vim-like keyboard navigation:

- `j` - Move down
- `k` - Move up
- `/` - Search
- `gg` - Go to top
- `G` - Go to bottom
- `Enter` - Open selected post

## Themes

The blog comes with several built-in themes:

- Tokyo Night (default)
- One Dark
- Gruvbox

To change themes, modify the theme prop in `src/app/layout.tsx`:

```typescript
<ThemeProvider theme="one-dark">
  {children}
</ThemeProvider>
```

## Project Structure

```
terminus-example/
├── content/
│   └── posts/           # Your blog posts in Markdown
├── public/              # Static assets
└── src/
    └── app/            # Next.js app directory
        ├── layout.tsx  # Root layout with theme provider
        └── page.tsx    # Homepage with post list
```

## Customization

1. **Themes**: Customize colors by modifying the theme provider
2. **Layout**: Adjust the layout in `src/app/layout.tsx`
3. **Styling**: Add custom styles to match your brand
4. **Content**: Add more posts in the `content/posts` directory

## Learn More

- [Terminus Documentation](https://github.com/chefFromSpace/terminus)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
