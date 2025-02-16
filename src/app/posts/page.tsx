import React from 'react';
import { getStaticPosts } from '@/utils/server-posts';

export default async function Posts(): Promise<React.ReactElement> {
  const posts = await getStaticPosts();
  const publishedPosts = posts.filter(post => !post.draft);
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      
      <div className="grid gap-6">
        {publishedPosts.map((post) => (
          <article
            key={post.id}
            className="p-6 rounded-lg border transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <a
              href={`/posts/${post.slug}`}
              data-nav-item
              className="block group"
            >
              <h2 className="text-2xl font-semibold transition-colors group-hover:text-[var(--accent-color)]">
                {post.title}
              </h2>
              <p className="mt-2 text-[var(--muted-color)]">
                {post.excerpt}
              </p>
              <div className="mt-4 text-sm text-[var(--muted-color)]">
                Use j/k to navigate, Enter to read
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
