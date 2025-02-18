'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePost } from '@/contexts/PostContext';
import { Sidebar } from './Sidebar';
import type { NavigationItem } from '@/types/navigation';

export function ClientSidebar() {
  const { currentPost, allPosts } = usePost();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sidebarVisible');
    if (stored !== null) {
      setIsSidebarVisible(stored === 'true');
    }
  }, []);

  const updateSidebarVisibility = (visible: boolean) => {
    setIsSidebarVisible(visible);
    localStorage.setItem('sidebarVisible', visible.toString());
    document.body.style.setProperty('--sidebar-visible', visible ? '1' : '0');
  };

  // Global navigation items
  const navigationItems: NavigationItem[] = useMemo(() => [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      description: 'Welcome page'
    },
    {
      id: 'about',
      label: 'About',
      href: '/about',
      description: 'Learn more about me'
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      description: 'View my projects'
    },
    {
      id: 'blog',
      label: 'Blog',
      href: '/posts',
      description: 'Read my latest posts'
    }
  ], []);

  return (
    <Sidebar
      currentPost={currentPost || undefined}
      allPosts={allPosts}
      navigationItems={navigationItems}
      defaultVisible={isSidebarVisible}
      onVisibilityChange={updateSidebarVisibility}
    />
  );
}
