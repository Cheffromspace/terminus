import type { Post } from '@/types/blog';
export declare function getStaticPosts(): Promise<Post[]>;
export declare function getStaticPostBySlug(slug: string): Promise<Post | null>;
export declare function getStaticPreviousAndNextPosts(currentSlug: string): Promise<{
    previous: Post | null;
    next: Post | null;
}>;
export declare function getFeaturedStaticPosts(): Promise<Post[]>;
