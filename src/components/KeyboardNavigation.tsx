'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/navigation';
import type { KeyboardNavigationProps, NavigationState, NavigationChild } from '@/types/blog';

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children: child,
  navigationItems
}) => {
  const router = useRouter();
  const [navState, setNavState] = useState<NavigationState>({
    currentIndex: 0,
    items: navigationItems
  });

  // Update navigation state when items change
  useEffect(() => {
    setNavState(prev => ({
      ...prev,
      items: navigationItems,
      currentIndex: Math.min(prev.currentIndex, navigationItems.length - 1)
    }));
  }, [navigationItems]);

  const navigateToItem = useCallback((index: number) => {
    const element = document.querySelector(`[data-nav-item="${index}"]`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setNavState(prev => ({
      ...prev,
      currentIndex: index
    }));
  }, []);

  // GPU-accelerated smooth scrolling with j/k
  const scrollState = useRef({
    isScrolling: false,
    velocity: 0,
    lastTime: 0,
    rafId: 0,
    keyHoldStart: 0,
    acceleration: 1,
  });

  const smoothScroll = useCallback(() => {
    if (!scrollState.current.isScrolling) return;

    const now = performance.now();
    scrollState.current.lastTime = now;

    // Calculate hold duration and adjust acceleration
    const holdDuration = now - scrollState.current.keyHoldStart;
    scrollState.current.acceleration = Math.min(
      3, // Max acceleration multiplier
      1 + (holdDuration / 300) // Faster acceleration
    );

    // Apply acceleration to velocity
    const scrollAmount = scrollState.current.velocity * scrollState.current.acceleration;

    // Use transform: translate3d for GPU acceleration
    window.scrollBy({
      top: scrollAmount,
      left: 0,
      behavior: 'auto' // Better performance than 'smooth'
    });

    scrollState.current.rafId = requestAnimationFrame(smoothScroll);
  }, []);

  const startScroll = useCallback((direction: number) => {
    if (!scrollState.current.isScrolling) {
      scrollState.current.isScrolling = true;
      scrollState.current.lastTime = performance.now();
      scrollState.current.keyHoldStart = performance.now();
      scrollState.current.velocity = direction * 25; // Increased base speed
      scrollState.current.acceleration = 1;
      smoothScroll();
    }
  }, [smoothScroll]);

  const stopScroll = useCallback(() => {
    scrollState.current.isScrolling = false;
    scrollState.current.acceleration = 1;
    if (scrollState.current.rafId) {
      cancelAnimationFrame(scrollState.current.rafId);
    }
  }, []);

  // Handle j/k scrolling with keydown/keyup events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'j' && !e.shiftKey) startScroll(1);
      if (e.key === 'k' && !e.shiftKey) startScroll(-1);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'k') stopScroll();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stopScroll();
    };
  }, [startScroll, stopScroll]);

  // Navigation with Shift+J/K
  useHotkeys('shift+j', () => {
    setNavState(prev => {
      const newIndex = Math.min(prev.currentIndex + 1, prev.items.length - 1);
      navigateToItem(newIndex);
      return {
        ...prev,
        currentIndex: newIndex
      };
    });
  }, { enableOnFormTags: false });

  useHotkeys('shift+k', () => {
    setNavState(prev => {
      const newIndex = Math.max(prev.currentIndex - 1, 0);
      navigateToItem(newIndex);
      return {
        ...prev,
        currentIndex: newIndex
      };
    });
  }, { enableOnFormTags: false });

  // Track last key press for 'gg' command
  const [lastKeyPress, setLastKeyPress] = useState<string | null>(null);
  const [lastKeyPressTime, setLastKeyPressTime] = useState<number>(0);

  // Quick navigation - top/bottom of article and first/last post
  useHotkeys('g', () => {
    const currentTime = Date.now();
    
    if (lastKeyPress === 'g' && currentTime - lastKeyPressTime < 500) {
      // Double 'g' press within 500ms
      if (window.location.pathname.includes('/posts/')) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        navigateToItem(0);
        setNavState(prev => ({
          ...prev,
          currentIndex: 0
        }));
      }
      setLastKeyPress(null); // Reset after handling
    } else {
      setLastKeyPress('g');
      setLastKeyPressTime(currentTime);
    }
  }, { enableOnFormTags: false });

  useHotkeys('shift+g', () => {
    // If we're in a post view (URL contains /posts/), scroll to bottom
    if (window.location.pathname.includes('/posts/')) {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight,
        behavior: 'instant'
      });
    } else {
      // Otherwise navigate to last post
      const lastIndex = navigationItems.length - 1;
      navigateToItem(lastIndex);
      setNavState(prev => ({
        ...prev,
        currentIndex: lastIndex
      }));
    }
  }, { enableOnFormTags: false });

  // Next/Previous with n/N
  useHotkeys('n', () => {
    setNavState(prev => {
      const newIndex = Math.min(prev.currentIndex + 1, prev.items.length - 1);
      navigateToItem(newIndex);
      return {
        ...prev,
        currentIndex: newIndex
      };
    });
  }, { enableOnFormTags: false });

  useHotkeys('shift+n', () => {
    setNavState(prev => {
      const newIndex = Math.max(prev.currentIndex - 1, 0);
      navigateToItem(newIndex);
      return {
        ...prev,
        currentIndex: newIndex
      };
    });
  }, { enableOnFormTags: false });

  // Home navigation
  useHotkeys('h', () => {
    router.push('/');
  }, { enableOnFormTags: false });

  // Enter to navigate
  useHotkeys('enter', () => {
    const currentItem = navState.items[navState.currentIndex];
    if (currentItem) {
      router.push(currentItem.href);
    }
  }, { enableOnFormTags: false });

  // Update ARIA attributes and focus management
  useEffect(() => {
    const elements = document.querySelectorAll('[data-nav-item]');
    elements.forEach((el, index) => {
      el.setAttribute('aria-selected', (index === navState.currentIndex).toString());
      el.setAttribute('tabindex', index === navState.currentIndex ? '0' : '-1');
      
      if (index === navState.currentIndex) {
        el.classList.add('nav-focus-indicator');
        // Only focus if the element is visible
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          (el as HTMLElement).focus({ preventScroll: true });
        }
      } else {
        el.classList.remove('nav-focus-indicator');
      }
    });
  }, [navState.currentIndex]);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite">
        Currently selected: {navState.items[navState.currentIndex]?.label}
      </div>
      <div className="sr-only" role="complementary">
        <p>Keyboard Navigation Instructions:</p>
        <ul>
          <li>Use J and K to scroll the article up and down</li>
          <li>Use Shift+J and Shift+K or N and Shift+N to navigate between posts</li>
          <li>Press Enter to view the selected post</li>
          <li>Use gg to scroll to top of article (in post view) or go to first post (in list view)</li>
          <li>Use Shift+G to scroll to bottom of article (in post view) or go to last post (in list view)</li>
          <li>Press H to return to the home page</li>
        </ul>
      </div>
      {React.cloneElement(child as NavigationChild, {
        className: child.props.className
      })}
    </>
  );
};

export default KeyboardNavigation;
