import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { getStaticPosts, getStaticPostBySlug, getStaticPreviousAndNextPosts } from '@/utils/server-posts';
import { PostUpdater } from '@/components/PostUpdater';
import { NavigationButtons } from '@/components/NavigationButtons';
import { Metadata } from 'next';
import React from 'react';

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
  return {
    title: post?.title,
    description: post?.description
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
    const { previous, next } = await getStaticPreviousAndNextPosts(slug);

    return (
      <>
        <PostUpdater
          currentPost={post}
          previousPost={previous}
          nextPost={next}
        />
        <div className="mb-8">
          <NavigationButtons previous={previous} next={next} />
        </div>
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
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
