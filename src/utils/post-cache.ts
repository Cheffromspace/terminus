import type { Post } from '../types/blog.js';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL.replace(/\/$/, '');
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return 'http://localhost:3000';
};

const constructUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  // Ensure path starts with / and remove any trailing /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

class PostCache {
  private static instance: PostCache | null = null;
  private posts: Post[] = [];
  private isInitialized = false;

  private constructor() {}

  static getInstance(): PostCache {
    if (!PostCache.instance) {
      PostCache.instance = new PostCache();
    }
    return PostCache.instance;
  }

  // Reset instance for edge runtime
  static resetInstance(): void {
    PostCache.instance = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    await this.loadManifest();
    this.isInitialized = true;
  }

  private async loadManifest() {
    try {
      // Only try filesystem in non-edge environments
      if (process.env.NEXT_RUNTIME !== 'edge') {
        try {
          // Use top-level await for imports to handle edge cases better
          const [fs, path] = await Promise.all([
            import('fs/promises').catch(() => null),
            import('path').catch(() => null)
          ]);

          if (fs && path) {
            const manifestPath = path.join(process.cwd(), 'public', 'content', 'manifest.json');
            const manifestContent = await fs.readFile(manifestPath, 'utf-8');
            const manifest = JSON.parse(manifestContent);
            
            // Load content for each post
            this.posts = await Promise.all(manifest.posts.map(async (post: Post) => ({
              ...post,
              content: await this.getPostContent(post.slug)
            })));
            return;
          }
        } catch (fsError) {
          console.debug('Filesystem access failed, falling back to fetch:', fsError);
        }
      }

      // Fallback to fetch for edge runtime
      const manifestUrl = constructUrl('/content/manifest.json');
      const response = await fetch(manifestUrl, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Content manifest not found. Run npm run build:content first.');
      }
      
      const manifest = await response.json();
      
      // Load content for each post
      this.posts = await Promise.all(manifest.posts.map(async (post: Post) => ({
        ...post,
        content: await this.getPostContent(post.slug)
      })));
    } catch (error) {
      console.error('Error loading content manifest:', error);
      throw new Error('Failed to load content manifest. Please ensure the build process completed successfully.');
    }
  }

  async getPostContent(slug: string): Promise<string> {
    try {
      // Only try filesystem in non-edge environments
      if (process.env.NEXT_RUNTIME !== 'edge') {
        try {
          const [fs, path] = await Promise.all([
            import('fs/promises').catch(() => null),
            import('path').catch(() => null)
          ]);

          if (fs && path) {
            const contentPath = path.join(process.cwd(), 'public', 'content', `${slug}.json`);
            const contentJson = await fs.readFile(contentPath, 'utf-8');
            const content = JSON.parse(contentJson);
            return content.preRenderedHtml;
          }
        } catch (fsError) {
          console.debug(`Filesystem access failed for ${slug}, falling back to fetch:`, fsError);
        }
      }

      // Fallback to fetch for edge runtime
      const postUrl = constructUrl(`/content/${slug}.json`);
      const response = await fetch(postUrl, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Post content not found for slug: ${slug}`);
      }
      
      const post = await response.json();
      return post.preRenderedHtml;
    } catch (error) {
      console.error(`Error loading post content for ${slug}:`, error);
      throw new Error(`Failed to load post content for ${slug}`);
    }
  }

  getPosts(): Post[] {
    if (!this.isInitialized) {
      throw new Error('PostCache not initialized');
    }
    return this.posts;
  }
}

// Reset instance between edge runtime requests
if (process.env.NEXT_RUNTIME === 'edge') {
  PostCache.resetInstance();
}

// Export both the class and the singleton instance
export { PostCache };
export const postCache = PostCache.getInstance();
