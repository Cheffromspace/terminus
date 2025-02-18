'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FixedSizeList as List } from 'react-window';
import type { Post } from '@/types/blog';
import { KeyboardNavigation } from '@/components/KeyboardNavigation';
import type { NavigationItem } from '@/types/navigation';

interface SidebarProps {
  currentPost?: Post;
  allPosts?: Post[];
  navigationItems?: NavigationItem[];
  className?: string;
  defaultVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

interface PostItemData {
  posts: Post[];
  currentPost: Post;
  onItemFocus: (index: number) => void;
}

interface PostItemProps {
  data: PostItemData;
  index: number;
  style: React.CSSProperties;
}

const ITEM_HEIGHT = 64; // Height for each post item
const ITEM_PADDING = 8; // Padding between items

const PostItem = React.memo(({ data, index, style }: PostItemProps) => {
  const { posts, currentPost, onItemFocus } = data;
  const post = posts[index];
  const isSelected = currentPost.slug === post.slug;

  return (
    <Link
      key={post.slug}
      href={`/posts/${post.slug}`}
      data-nav-item={index}
      role="option"
      aria-selected={isSelected}
      onFocus={() => onItemFocus(index)}
      className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 ease-in-out min-h-[${ITEM_HEIGHT}px] focus:outline-none focus:ring-2 focus:ring-[var(--link)] focus-visible:ring-2 focus-visible:ring-[var(--link)] ${
        isSelected
          ? 'bg-[var(--selection)] text-[var(--foreground)] shadow-sm font-medium'
          : 'hover:bg-[var(--background-muted)] bg-transparent'
      }`}
      style={{
        ...style,
        top: `${parseFloat(style.top as string) + ITEM_PADDING}px`,
        contain: 'content',
      }}
    >
      <span className="line-clamp-2">
        {post.title}
        {post.series && (
          <span className="block text-xs text-[var(--comment)] mt-0.5">
            {post.series.name} - Part {post.series.order} of {post.series.totalParts}
          </span>
        )}
      </span>
    </Link>
  );
});

PostItem.displayName = 'PostItem';

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPost, 
  allPosts,
  navigationItems = [],
  className,
  defaultVisible = true,
  onVisibilityChange
}) => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    setIsSidebarVisible(defaultVisible);
  }, [defaultVisible]);

  useEffect(() => {
    onVisibilityChange?.(isSidebarVisible);
  }, [isSidebarVisible, onVisibilityChange]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const listRef = useRef<List>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    // If we have posts, create navigation items from them
    if (allPosts?.length) {
      const filtered = !searchQuery ? allPosts : allPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.series?.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      return filtered.map(post => ({
        id: post.slug,
        label: post.title,
        href: `/posts/${post.slug}`,
        description: post.series ? `${post.series.name} - Part ${post.series.order} of ${post.series.totalParts}` : undefined
      }));
    }
    
    // Otherwise use provided navigation items
    if (navigationItems?.length) {
      return !searchQuery ? navigationItems : navigationItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return [];
  }, [allPosts, navigationItems, searchQuery]);

  const handleItemFocus = (index: number) => {
    listRef.current?.scrollToItem(index, 'smart');
  };

  // Calculate current index and initial scroll position
  const { currentIndex, initialScrollIndex } = useMemo(() => {
    if (currentPost && allPosts) {
      const idx = items.findIndex(item => item.id === currentPost.slug);
      return { currentIndex: idx, initialScrollIndex: idx };
    }
    return { currentIndex: 0, initialScrollIndex: 0 };
  }, [items, currentPost]);

  // Initialize scroll position
  useEffect(() => {
    if (initialScrollIndex !== -1 && listRef.current) {
      listRef.current.scrollToItem(initialScrollIndex, 'smart');
    }
  }, [initialScrollIndex]); // Include initialScrollIndex in deps array to properly handle updates

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '?' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsHelpVisible(prev => !prev);
      }
      if (e.key === '`' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsSidebarVisible(prev => !prev);
      }
      if (e.key === '/' && !isSearching) {
        e.preventDefault();
        setIsSearching(true);
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        if (isSearching) {
          e.preventDefault();
          setIsSearching(false);
          setSearchQuery('');
          searchInputRef.current?.blur();
        } else if (isHelpVisible) {
          setIsHelpVisible(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSearching, isHelpVisible]);

  const sidebarContent = (
    <nav 
      className={`fixed left-0 top-0 h-screen w-72 bg-[var(--background)] border-r border-[var(--border)] transform transition-transform duration-150 ease-out ${
        isSidebarVisible ? 'translate-x-0' : '-translate-x-72'
      } ${className || ''}`}
      aria-label="Site navigation"
    >
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--background)] focus:ring-2 focus:ring-[var(--link)]"
      >
        Skip to main content
      </a>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarVisible(prev => !prev)}
        className="fixed left-72 top-4 p-2 bg-[var(--background)] border border-[var(--border)] rounded-r-lg shadow-sm hover:bg-[var(--selection)] transition-colors duration-150 z-10"
        aria-label={`${isSidebarVisible ? 'Hide' : 'Show'} sidebar (Press \` to toggle)`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transform transition-transform duration-150 ${isSidebarVisible ? 'rotate-0' : 'rotate-180'}`}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="h-full flex flex-col p-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search navigation... (Press / to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setIsSearching(false)}
            className="w-full px-3 py-2 text-sm bg-[var(--background-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--link)] text-[var(--foreground)]"
            aria-label="Search navigation items"
          />
          {searchQuery && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--comment)]">
              {items.length} results
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 min-h-0">
          <h3 className="text-sm font-semibold mb-3 text-[var(--comment)] uppercase tracking-wider flex items-center justify-between">
            <span>{allPosts?.length ? 'Blog Posts' : 'Navigation'}</span>
            <button
              onClick={() => setIsHelpVisible(true)}
              className="text-xs font-normal normal-case text-[var(--comment)] hover:text-[var(--foreground)]"
              aria-label="Show keyboard shortcuts"
            >
              ? Help
            </button>
          </h3>
          <div 
            role="listbox"
            aria-label="Navigation items"
            className="h-full"
            tabIndex={0}
          >
          <List
            ref={listRef}
            height={600}
            itemCount={items.length}
            itemSize={ITEM_HEIGHT + ITEM_PADDING}
            width="100%"
          >
            {({ index, style }) => {
              const item = items[index];
              const isSelected = currentPost ? item.id === currentPost.slug : false;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  data-nav-item={index}
                  role="option"
                  aria-selected={isSelected}
                  onFocus={() => handleItemFocus(index)}
                  className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 ease-in-out min-h-[${ITEM_HEIGHT}px] focus:outline-none focus:ring-2 focus:ring-[var(--link)] focus-visible:ring-2 focus-visible:ring-[var(--link)] ${
                    isSelected
                      ? 'bg-[var(--selection)] text-[var(--foreground)] shadow-sm font-medium'
                      : 'hover:bg-[var(--background-muted)] bg-transparent'
                  }`}
                  style={{
                    ...style,
                    top: `${parseFloat(style.top as string) + ITEM_PADDING}px`,
                    contain: 'content',
                  }}
                >
                  <span className="line-clamp-2">
                    {item.label}
                    {item.description && (
                      <span className="block text-xs text-[var(--comment)] mt-0.5">
                        {item.description}
                      </span>
                    )}
                  </span>
                </Link>
              );
            }}
          </List>
          </div>
        </div>
      </div>

      {/* Live Region for Announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {searchQuery 
          ? `${items.length} items found` 
          : currentPost 
            ? `${currentPost.title} - ${currentIndex + 1} of ${items.length} items`
            : `${items.length} navigation items`}
      </div>
    </nav>
  );

  return (
    <>
      <KeyboardNavigation navigationItems={items}>
        {sidebarContent}
      </KeyboardNavigation>

      {/* Help Overlay */}
      {isHelpVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div 
            className="bg-[var(--background)] p-6 rounded-lg max-w-md w-full mx-4 shadow-xl border border-[var(--border)]"
            role="dialog"
            aria-label="Keyboard shortcuts"
          >
            <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Keyboard Shortcuts</h2>
            <dl className="space-y-2 text-[var(--foreground)]">
              <div className="flex justify-between">
                <dt className="font-mono">Shift + J/K</dt>
                <dd>Navigate items</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono">Enter</dt>
                <dd>Open selected item</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono">g g</dt>
                <dd>Go to first item</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono">Shift + G</dt>
                <dd>Go to last item</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono">/</dt>
                <dd>Search items (Esc to clear)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono">`</dt>
                <dd>Toggle sidebar</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono">?</dt>
                <dd>Show/hide this help</dd>
              </div>
            </dl>
            <button
              onClick={() => setIsHelpVisible(false)}
              className="mt-4 w-full px-4 py-2 bg-[var(--link)] text-[var(--background)] rounded-lg hover:opacity-90 transition-colors duration-150"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
