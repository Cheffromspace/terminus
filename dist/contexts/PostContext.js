'use client';
import React, { createContext, useContext, useState } from 'react';
var PostContext = createContext(null);
export function PostProvider(_a) {
    var children = _a.children, _b = _a.initialPost, initialPost = _b === void 0 ? null : _b, _c = _a.initialPrevious, initialPrevious = _c === void 0 ? null : _c, _d = _a.initialNext, initialNext = _d === void 0 ? null : _d, _e = _a.initialAllPosts, initialAllPosts = _e === void 0 ? [] : _e;
    var _f = useState(initialPost), currentPost = _f[0], setCurrentPost = _f[1];
    var _g = useState(initialPrevious), previousPost = _g[0], setPreviousPost = _g[1];
    var _h = useState(initialNext), nextPost = _h[0], setNextPost = _h[1];
    var _j = useState(initialAllPosts), allPosts = _j[0], setAllPosts = _j[1];
    var value = {
        currentPost: currentPost,
        previousPost: previousPost,
        nextPost: nextPost,
        allPosts: allPosts,
        setCurrentPost: setCurrentPost,
        setPreviousPost: setPreviousPost,
        setNextPost: setNextPost,
        setAllPosts: setAllPosts,
    };
    return React.createElement(PostContext.Provider, { value: value }, children);
}
export function usePost() {
    var context = useContext(PostContext);
    if (!context) {
        throw new Error('usePost must be used within a PostProvider');
    }
    return context;
}
