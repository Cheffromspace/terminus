import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { readFile, readdir } from 'fs/promises';
import type { Post } from '@/types/blog';

const POSTS_DIRECTORY = process.env.BLOG_CONTENT_DIR 
  ? path.join(process.cwd(), process.env.BLOG_CONTENT_DIR)
  : path.join(process.cwd(), 'content', 'posts');

export async function getStaticPosts(): Promise<Post[]> {
  return getAllStaticPosts();
}

export async function getStaticPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllStaticPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function getStaticPreviousAndNextPosts(currentSlug: string): Promise<{ previous: Post | null; next: Post | null }> {
  try {
    const posts = await getAllStaticPosts();
    const currentIndex = posts.findIndex(post => post.slug === currentSlug);
    
    if (currentIndex === -1) {
      return { previous: null, next: null };
    }

    return {
      previous: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
      next: currentIndex > 0 ? posts[currentIndex - 1] : null
    };
  } catch (error) {
    console.error('Error getting previous and next posts:', error);
    return { previous: null, next: null };
  }
}

export async function getFeaturedStaticPosts(): Promise<Post[]> {
  const allPosts = await getAllStaticPosts();
  const publishedPosts = filterPublishedPosts(allPosts);
  const seriesPosts = publishedPosts.filter(post => post.series);
  const recentPosts = publishedPosts
    .filter(post => !post.series)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return [...seriesPosts.slice(0, 2), ...recentPosts.slice(0, 2)];
}

async function getAllStaticPosts(): Promise<Post[]> {
  try {
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      console.error(`Posts directory not found: ${POSTS_DIRECTORY}`);
      throw new Error('Posts directory not found');
    }
    
    const files = await readdir(POSTS_DIRECTORY);
    if (files.length === 0) {
      console.warn('No markdown files found in posts directory');
      return [];
    }

    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async file => {
          const filePath = path.join(POSTS_DIRECTORY, file);
          const content = await readFile(filePath, 'utf-8');
          const { data, content: markdown } = matter(content);
          
          return {
            id: path.basename(file, '.md'),
            title: data.title,
            slug: data.slug || path.basename(file, '.md'),
            date: new Date(data.date).toISOString(),
            publishDate: data.publishDate ? new Date(data.publishDate).toISOString() : undefined,
            content: markdown,
            description: data.description || '',
            draft: data.draft || false,
            excerpt: data.excerpt || data.description || '',
            series: data.series ? {
              name: data.series,
              order: parseInt(data.title.match(/Part (\d+)/)?.[1] || '1'),
              totalParts: files.filter(f => 
                f.endsWith('.md') && 
                matter(fs.readFileSync(path.join(POSTS_DIRECTORY, f), 'utf-8')).data.series === data.series
              ).length
            } : undefined
          } as Post;
        })
    );

    return posts.sort((a, b) => {
      if (a.series && b.series && a.series.name === b.series.name) {
        return a.series.order - b.series.order;
      }
      if (a.series && !b.series) return -1;
      if (!a.series && b.series) return 1;
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error in getAllStaticPosts:', error);
    throw error;
  }
}

function filterPublishedPosts(posts: Post[]): Post[] {
  const now = new Date().toISOString();
  return posts.filter(post => {
    if (post.draft) return false;
    if (!post.publishDate) return true;
    return post.publishDate <= now;
  });
}
