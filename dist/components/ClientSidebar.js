'use client';
'use client';
import React, { useState, useEffect } from 'react';
import { usePost } from '@/contexts/PostContext';
import { Sidebar } from './Sidebar';
export function ClientSidebar() {
    var _a = usePost(), currentPost = _a.currentPost, allPosts = _a.allPosts;
    var _b = useState(true), isSidebarVisible = _b[0], setIsSidebarVisible = _b[1];
    // Share sidebar visibility state with layout
    useEffect(function () {
        document.body.style.setProperty('--sidebar-visible', isSidebarVisible ? '1' : '0');
    }, [isSidebarVisible]);
    return (React.createElement(Sidebar, { currentPost: currentPost || allPosts[0], allPosts: allPosts, defaultVisible: isSidebarVisible, onVisibilityChange: setIsSidebarVisible }));
}
