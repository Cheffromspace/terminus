'use client';

import React, { createContext, useContext, useState } from 'react';
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

const PostContext = createContext<PostContextType | null>(null);

export function PostProvider({
  children,
  initialPost = null,
  initialPrevious = null,
  initialNext = null,
  initialAllPosts = [],
}: {
  children: React.ReactNode;
  initialPost?: Post | null;
  initialPrevious?: Post | null;
  initialNext?: Post | null;
  initialAllPosts?: Post[];
}) {
  const [currentPost, setCurrentPost] = useState<Post | null>(initialPost);
  const [previousPost, setPreviousPost] = useState<Post | null>(initialPrevious);
  const [nextPost, setNextPost] = useState<Post | null>(initialNext);
  const [allPosts, setAllPosts] = useState<Post[]>(initialAllPosts);

  const value = {
    currentPost,
    previousPost,
    nextPost,
    allPosts,
    setCurrentPost,
    setPreviousPost,
    setNextPost,
    setAllPosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}
