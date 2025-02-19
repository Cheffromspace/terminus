import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClientSidebar } from '@/components/ClientSidebar';
import { PostProvider } from '@/contexts/PostContext';
import { getStaticPosts } from '@/utils/server-posts';
import { HomeButton } from '@/components/HomeButton';
import Link from 'next/link';


const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  metadataBase: new URL('https://jonathanflatt.dev'),
  title: {
    default: 'Jonathan Flatt',
    template: '%s | Jonathan Flatt'
  },
  description: 'DevOps engineer writing about tooling, automation, and AI-assisted development. Exploring the intersection of DevOps, AI, and modern development practices.',
  keywords: ['DevOps', 'automation', 'AI', 'development', 'tooling', 'software engineering', 'salesforce'],
  authors: [{ name: 'Jonathan Flatt' }],
  creator: 'Jonathan Flatt',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jonathanflatt.dev',
    siteName: 'Jonathan Flatt',
    title: 'Jonathan Flatt - DevOps Engineer',
    description: 'DevOps engineer writing about tooling, automation, and AI-assisted development. Exploring the intersection of DevOps, AI, and modern development practices.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://jonathanflatt.dev',
    types: {
      'application/rss+xml': 'https://jonathanflatt.dev/feed.xml',
    },
  }
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const allPosts = await getStaticPosts();
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed for jonathanflatt.dev" href="/feed.xml" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Jonathan Flatt",
            "url": "https://jonathanflatt.dev",
            "jobTitle": "DevOps Engineer",
            "description": "DevOps engineer writing about tooling, automation, and AI-assisted development",
            "sameAs": [
              "https://github.com/cheffromspace"
            ]
          })}
        </script>
      </head>
      <body className={`${inter.className} antialiased`} style={{ '--sidebar-visible': '1' } as React.CSSProperties}>
        <ThemeProvider>
          <PostProvider initialAllPosts={allPosts}>
            <div className="min-h-screen">
              <ClientSidebar />
              <main className="content-wrapper">
                <header className="border-b border-[var(--border)] py-4">
                  <div className="content-container max-w-4xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-[var(--comment)]">
                          Press ? for keyboard shortcuts
                        </div>
                        <nav className="flex gap-4">
                          <Link href="/about" className="hover:text-[var(--accent)]">About</Link>
                          <Link href="/projects" className="hover:text-[var(--accent)]">Projects</Link>
                          <Link href="/posts" className="hover:text-[var(--accent)]">Blog</Link>
                        </nav>
                      </div>
                    </div>
                  </div>
                </header>
                <div id="main-content" className="content-container max-w-4xl py-8">
                  {children}
                  <HomeButton />
                </div>
                <footer className="border-t border-[var(--border)] py-4 mt-8">
                  <div className="content-container max-w-4xl text-center text-[var(--comment)]">
                    <p>Use vim keys (j/k) to navigate, Enter to select</p>
                  </div>
                </footer>
              </main>
            </div>
          </PostProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
