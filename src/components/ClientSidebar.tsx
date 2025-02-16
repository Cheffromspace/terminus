'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { usePost } from '@/contexts/PostContext';
import { Sidebar } from './Sidebar';

export function ClientSidebar() {
  const { currentPost, allPosts } = usePost();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Share sidebar visibility state with layout
  useEffect(() => {
    document.body.style.setProperty('--sidebar-visible', isSidebarVisible ? '1' : '0');
  }, [isSidebarVisible]);

  return (
    <Sidebar
      currentPost={currentPost || allPosts[0]}
      allPosts={allPosts}
      defaultVisible={isSidebarVisible}
      onVisibilityChange={setIsSidebarVisible}
    />
  );
}
