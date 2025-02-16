'use client';

import { useEffect } from 'react';
import type { Post } from '@/types/blog';
import { usePost } from '@/contexts/PostContext';

interface PostUpdaterProps {
  currentPost: Post;
  previousPost: Post | null;
  nextPost: Post | null;
}

export function PostUpdater({ currentPost, previousPost, nextPost }: PostUpdaterProps) {
  const { setCurrentPost, setPreviousPost, setNextPost } = usePost();

  useEffect(() => {
    setCurrentPost(currentPost);
    setPreviousPost(previousPost);
    setNextPost(nextPost);
  }, [currentPost, previousPost, nextPost, setCurrentPost, setPreviousPost, setNextPost]);

  // This component doesn't render anything
  return null;
}
