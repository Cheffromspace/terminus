import type { Post } from '@/types/blog';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT || 3003}`; // dev SSR should use localhost
};

export async function getAllPosts(): Promise<Post[]> {
  const response = await fetch(`${getBaseUrl()}/api/posts`, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const response = await fetch(`${getBaseUrl()}/api/posts?featured=true`, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to fetch featured posts');
  return response.json();
}

export async function searchPosts(query: string): Promise<Post[]> {
  const response = await fetch(`${getBaseUrl()}/api/posts?q=${encodeURIComponent(query)}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to search posts');
  return response.json();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function getPreviousAndNextPosts(currentSlug: string): Promise<{ previous: Post | null; next: Post | null }> {
  try {
    const posts = await getAllPosts();
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
