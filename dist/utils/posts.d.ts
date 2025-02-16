import type { Post } from '@/types/blog';
export declare function getAllPosts(): Promise<Post[]>;
export declare function getFeaturedPosts(): Promise<Post[]>;
export declare function searchPosts(query: string): Promise<Post[]>;
export declare function getPostBySlug(slug: string): Promise<Post | null>;
export declare function getPreviousAndNextPosts(currentSlug: string): Promise<{
    previous: Post | null;
    next: Post | null;
}>;
