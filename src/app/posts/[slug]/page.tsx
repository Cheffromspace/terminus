import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { getStaticPosts, getStaticPostBySlug } from '@/utils/server-posts';
import { PostUpdater } from '@/components/PostUpdater';
import { Metadata } from 'next';
import React from 'react';
import type { Post } from '@/types/blog';

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getStaticPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getStaticPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  const publishedTime = new Date(post.date).toISOString();
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags || [],
    authors: [{ name: 'Jonathan Flatt' }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime,
      authors: ['Jonathan Flatt'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://jonathanflatt.dev/posts/${post.slug}`,
    },
    other: {
      'article:published_time': publishedTime,
      'reading-time': `${readingTime} min read`,
    }
  };
}

// Add structured data for the blog post
function generateStructuredData(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: 'Jonathan Flatt',
      url: 'https://jonathanflatt.dev'
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    publisher: {
      '@type': 'Person',
      name: 'Jonathan Flatt',
      url: 'https://jonathanflatt.dev'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://jonathanflatt.dev/posts/${post.slug}`
    },
    keywords: post.tags?.join(', '),
    articleBody: post.excerpt || post.description
  };
}

export default async function PostPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  try {
    const post = await getStaticPostBySlug(slug);
    if (!post) {
      throw new Error(`Post not found: ${slug}`);
    }
    return (
      <>
        <PostUpdater
          currentPost={post}
          previousPost={null}
          nextPost={null}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(post))
          }}
        />
        <article className="h-entry">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2 p-name">{post.title}</h1>
            <div className="text-[var(--comment)] mb-4">
              <time className="dt-published" dateTime={new Date(post.date).toISOString()}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {' · '}
              <span>{Math.ceil(post.content.split(/\s+/).length / 200)} min read</span>
            </div>
            {post.series && (
              <p className="text-gray-600 dark:text-gray-400">
                {post.series.name} - Part {post.series.order} of {post.series.totalParts}
              </p>
            )}
          </header>
          <MarkdownRenderer 
            content={post.content} 
            frontmatter={{
              title: post.title,
              date: post.date,
              description: post.description,
              series: post.series,
              draft: post.draft,
              excerpt: post.excerpt
            }} 
          />
        </article>
      </>
    );
  } catch (error) {
    console.error('Error reading post:', error);
    return (
      <div>
        <h1 className="text-2xl font-bold text-red-600">Error Loading Post</h1>
        <p className="mt-4">Sorry, we couldn&apos;t load the requested post.</p>
      </div>
    );
  }
}
