import type { Post } from '@/types/blog';

export async function getStaticPosts(): Promise<Post[]> {
  const cache = (await import('./post-cache')).postCache;
  await cache.initialize();
  return cache.getPosts();
}

export async function getStaticPostBySlug(slug: string): Promise<Post | null> {
  const cache = (await import('./post-cache')).postCache;
  await cache.initialize();
  const posts = cache.getPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function getStaticPreviousAndNextPosts(currentSlug: string): Promise<{ previous: Post | null; next: Post | null }> {
  try {
    const cache = (await import('./post-cache')).postCache;
    await cache.initialize();
    const posts = cache.getPosts();
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
  const cache = (await import('./post-cache')).postCache;
  await cache.initialize();
  const allPosts = cache.getPosts();
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
