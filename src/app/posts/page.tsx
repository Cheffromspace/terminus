import React from 'react';
import { getStaticPosts } from '@/utils/server-posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Posts | Jonathan Flatt',
  description: 'Articles about DevOps, automation, AI-assisted development, and software engineering best practices.',
  openGraph: {
    title: 'Blog Posts | Jonathan Flatt',
    description: 'Articles about DevOps, automation, AI-assisted development, and software engineering best practices.',
    type: 'website',
    url: 'https://jonathanflatt.dev/posts',
  },
  alternates: {
    canonical: 'https://jonathanflatt.dev/posts',
  }
};

export default async function Posts(): Promise<React.ReactElement> {
  const posts = await getStaticPosts();
  const publishedPosts = posts.filter(post => !post.draft);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: publishedPosts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://jonathanflatt.dev/posts/${post.slug}`,
                name: post.title,
                description: post.excerpt
              }))
            },
            name: 'Blog Posts',
            description: 'Articles about DevOps, automation, AI-assisted development, and software engineering best practices.'
          })
        }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        
        <div className="grid gap-6 h-feed">
          {publishedPosts.map((post) => (
            <article
            key={post.id}
            className="h-entry p-6 rounded-lg border transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <a
              href={`/posts/${post.slug}`}
              data-nav-item
              className="block group u-url"
            >
              <h2 className="p-name text-2xl font-semibold transition-colors group-hover:text-[var(--accent-color)]">
                {post.title}
              </h2>
              <p className="p-summary mt-2 text-[var(--muted-color)]">
                {post.excerpt}
              </p>
              <div className="mt-4 text-sm text-[var(--muted-color)] flex items-center justify-between">
                <time className="dt-published" dateTime={new Date(post.date).toISOString()}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>Use j/k to navigate, Enter to read</span>
              </div>
            </a>
          </article>
        ))}
        </div>
      </div>
    </>
  );
}
