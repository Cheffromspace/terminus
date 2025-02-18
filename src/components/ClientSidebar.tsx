'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { usePost } from '@/contexts/PostContext';
import { Sidebar } from './Sidebar';

export function ClientSidebar() {
  const { currentPost, allPosts } = usePost();
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('sidebarVisible');
    return stored === null ? true : stored === 'true';
  });

  const updateSidebarVisibility = (visible: boolean) => {
    setIsSidebarVisible(visible);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarVisible', visible.toString());
    }
  };

  // Share sidebar visibility state with layout and persist
  useEffect(() => {
    document.body.style.setProperty('--sidebar-visible', isSidebarVisible ? '1' : '0');
  }, [isSidebarVisible]);

  // Don't render until we have a valid current post
  if (!currentPost || !allPosts.length) {
    return null;
  }

  return (
    <Sidebar
      currentPost={currentPost}
      allPosts={allPosts}
      defaultVisible={isSidebarVisible}
      onVisibilityChange={updateSidebarVisibility}
    />
  );
}
