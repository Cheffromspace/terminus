import type { Post } from '@/types/blog';
interface PostUpdaterProps {
    currentPost: Post;
    previousPost: Post | null;
    nextPost: Post | null;
}
export declare function PostUpdater({ currentPost, previousPost, nextPost }: PostUpdaterProps): null;
export {};
