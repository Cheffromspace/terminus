import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/template.css';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClientSidebar } from '@/components/ClientSidebar';
import { PostProvider } from '@/contexts/PostContext';
import { getStaticPosts } from '@/utils/server-posts';
import { HomeButton } from '@/components/HomeButton';
import { tokyoNight } from '@/themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TechStack Chronicles',
  description: 'A technical blog exploring cloud, data, DevOps, and beyond - with vim-style navigation',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const allPosts = await getStaticPosts();
  const defaultTheme = tokyoNight;

  return (
    <html lang="en" data-theme={defaultTheme.metadata.name}>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <PostProvider initialAllPosts={allPosts}>
            <div className="flex min-h-screen">
              <ClientSidebar />
              <div className="flex-1" style={{ marginLeft: 'calc(var(--sidebar-width) * var(--sidebar-visible))' }}>
                <header className="border-b border-[var(--border)] py-4">
                  <nav className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[var(--comment)]">
                        Press ? for keyboard shortcuts
                      </div>
                    </div>
                  </nav>
                </header>
                <main id="main-content" className="container mx-auto px-4 py-8">
                  {children}
                  <HomeButton />
                </main>
                <footer className="border-t border-[var(--border)] py-4 mt-8">
                  <div className="container mx-auto px-4 text-center text-[var(--comment)]">
                    <p>Use vim keys (j/k) to navigate, Enter to select</p>
                  </div>
                </footer>
              </div>
            </div>
          </PostProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
