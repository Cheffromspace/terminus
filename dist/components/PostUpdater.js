'use client';
import { useEffect } from 'react';
import { usePost } from '@/contexts/PostContext';
export function PostUpdater(_a) {
    var currentPost = _a.currentPost, previousPost = _a.previousPost, nextPost = _a.nextPost;
    var _b = usePost(), setCurrentPost = _b.setCurrentPost, setPreviousPost = _b.setPreviousPost, setNextPost = _b.setNextPost;
    useEffect(function () {
        setCurrentPost(currentPost);
        setPreviousPost(previousPost);
        setNextPost(nextPost);
    }, [currentPost, previousPost, nextPost, setCurrentPost, setPreviousPost, setNextPost]);
    // This component doesn't render anything
    return null;
}
