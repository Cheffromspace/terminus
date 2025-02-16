import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--foreground)',
            '--tw-prose-headings': 'var(--foreground)',
            '--tw-prose-links': 'var(--link-color)',
            '--tw-prose-bold': 'var(--foreground)',
            '--tw-prose-counters': 'var(--muted-color)',
            '--tw-prose-bullets': 'var(--muted-color)',
            '--tw-prose-hr': 'var(--border-color)',
            '--tw-prose-quotes': 'var(--foreground)',
            '--tw-prose-quote-borders': 'var(--accent-color)',
            '--tw-prose-captions': 'var(--muted-color)',
            '--tw-prose-code': 'var(--foreground)',
            '--tw-prose-pre-code': 'var(--foreground)',
            '--tw-prose-pre-bg': 'var(--code-background)',
            '--tw-prose-th-borders': 'var(--border-color)',
            '--tw-prose-td-borders': 'var(--border-color)',
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
