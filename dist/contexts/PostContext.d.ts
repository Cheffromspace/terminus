import React from 'react';
import type { Post } from '@/types/blog';
interface PostContextType {
    currentPost: Post | null;
    previousPost: Post | null;
    nextPost: Post | null;
    allPosts: Post[];
    setCurrentPost: (post: Post) => void;
    setPreviousPost: (post: Post | null) => void;
    setNextPost: (post: Post | null) => void;
    setAllPosts: (posts: Post[]) => void;
}
export declare function PostProvider({ children, initialPost, initialPrevious, initialNext, initialAllPosts, }: {
    children: React.ReactNode;
    initialPost?: Post | null;
    initialPrevious?: Post | null;
    initialNext?: Post | null;
    initialAllPosts?: Post[];
}): React.JSX.Element;
export declare function usePost(): PostContextType;
export {};
