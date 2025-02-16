import type { Post } from '@/types/blog';
import { watch, existsSync, readFileSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { readFile, readdir } from 'fs/promises';

const POSTS_DIRECTORY = process.env.BLOG_CONTENT_DIR 
  ? path.join(process.cwd(), process.env.BLOG_CONTENT_DIR)
  : path.join(process.cwd(), 'content', 'posts');

class PostCache {
  private static instance: PostCache;
  private posts: Post[] = [];
  private isInitialized = false;
  private watcher: ReturnType<typeof watch> | null = null;

  private constructor() {}

  static getInstance(): PostCache {
    if (!PostCache.instance) {
      PostCache.instance = new PostCache();
    }
    return PostCache.instance;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    await this.compilePosts();
    this.isInitialized = true;

    // In development, watch for changes
    if (process.env.NODE_ENV === 'development') {
      const contentDir = process.env.BLOG_CONTENT_DIR 
        ? path.join(process.cwd(), process.env.BLOG_CONTENT_DIR)
        : path.join(process.cwd(), 'content', 'posts');

      this.watcher = watch(contentDir, { recursive: true }, async (eventType, filename) => {
        if (filename?.endsWith('.md')) {
          console.log(`Content change detected in ${filename}, recompiling posts...`);
          await this.compilePosts();
        }
      });
    }
  }

  private async compilePosts() {
    try {
      if (!existsSync(POSTS_DIRECTORY)) {
        console.error(`Posts directory not found: ${POSTS_DIRECTORY}`);
        throw new Error('Posts directory not found');
      }
      
      const files = await readdir(POSTS_DIRECTORY);
      if (files.length === 0) {
        console.warn('No markdown files found in posts directory');
        this.posts = [];
        return;
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
                totalParts: files.filter(f => {
                  if (!f.endsWith('.md')) return false;
                  const fileContent = readFileSync(path.join(POSTS_DIRECTORY, f), 'utf-8');
                  return matter(fileContent).data.series === data.series;
                }).length
              } : undefined
            } as Post;
          })
      );

      this.posts = posts.sort((a, b) => {
        if (a.series && b.series && a.series.name === b.series.name) {
          return a.series.order - b.series.order;
        }
        if (a.series && !b.series) return -1;
        if (!a.series && b.series) return 1;
        const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.title.localeCompare(b.title);
      });

      console.log(`Compiled ${this.posts.length} posts`);
    } catch (error) {
      console.error('Error compiling posts:', error);
      throw error;
    }
  }

  getPosts(): Post[] {
    if (!this.isInitialized) {
      throw new Error('PostCache not initialized');
    }
    return this.posts;
  }

  cleanup() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}

export const postCache = PostCache.getInstance();
