import React from 'react';
import { ThemeProvider } from 'terminus-blog-engine';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terminus Blog Example',
  description: 'Example implementation of the Terminus blog engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme="tokyo-night">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
