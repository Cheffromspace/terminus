import type { Post } from '@/types/blog';
import fs from 'fs/promises';
import path from 'path';

async function readManifest(): Promise<Post[]> {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'content', 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    return manifest.posts;
  } catch (error) {
    console.error('Error reading manifest:', error);
    return [];
  }
}

async function readPostContent(slug: string): Promise<string> {
  try {
    const contentPath = path.join(process.cwd(), 'public', 'content', `${slug}.json`);
    const contentJson = await fs.readFile(contentPath, 'utf-8');
    const content = JSON.parse(contentJson);
    return content.preRenderedHtml;
  } catch (error) {
    console.error(`Error reading post content for ${slug}:`, error);
    return '';
  }
}

export async function getStaticPosts(): Promise<Post[]> {
  const posts = await readManifest();
  // Load content for each post
  return Promise.all(posts.map(async (post) => ({
    ...post,
    content: await readPostContent(post.slug)
  })));
}

export async function getStaticPostBySlug(slug: string): Promise<Post | null> {
  const posts = await readManifest();
  const post = posts.find(post => post.slug === slug);
  if (!post) return null;
  
  // Load content for the specific post
  const content = await readPostContent(slug);
  return {
    ...post,
    content
  };
}

export async function getStaticPreviousAndNextPosts(currentSlug: string): Promise<{ previous: Post | null; next: Post | null }> {
  try {
    const posts = await readManifest();
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
  const allPosts = await readManifest();
  const publishedPosts = filterPublishedPosts(allPosts);
  const seriesPosts = publishedPosts.filter(post => post.series);
  const recentPosts = publishedPosts
    .filter(post => !post.series)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return [...seriesPosts.slice(0, 2), ...recentPosts.slice(0, 2)];
}

function filterPublishedPosts(posts: Post[]): Post[] {
  const now = new Date().toISOString();
  return posts.filter(post => {
    if (post.draft) return false;
    if (!post.publishDate) return true;
    return post.publishDate <= now;
  });
}
