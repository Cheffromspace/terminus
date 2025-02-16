"use client";

import React from 'react';
import Link from 'next/link';
import type { Post } from '@/types/blog';

interface NavigationButtonsProps {
  previous: Post | null;
  next: Post | null;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ previous, next }) => {
  return (
    <div className="flex flex-row gap-4 mb-4 justify-center w-full min-w-[200px]">
      <Link
        href={previous ? `/posts/${previous.slug}` : '#'}
        className={`px-4 py-2 text-[var(--link)] bg-[var(--background)] border border-[var(--border)] rounded flex items-center min-w-[120px] ${!previous ? 'opacity-50 pointer-events-none' : 'hover:bg-[var(--selection)]'} transition-colors`}
        aria-disabled={!previous}
        tabIndex={previous ? 0 : -1}
      >
        <span className="text-xl mr-2">←</span>
        <span>Previous</span>
      </Link>

      <Link
        href={next ? `/posts/${next.slug}` : '#'}
        className={`px-4 py-2 text-[var(--link)] bg-[var(--background)] border border-[var(--border)] rounded flex items-center justify-end min-w-[120px] ${!next ? 'opacity-50 pointer-events-none' : 'hover:bg-[var(--selection)]'} transition-colors`}
        aria-disabled={!next}
        tabIndex={next ? 0 : -1}
      >
        <span>Next</span>
        <span className="text-xl ml-2">→</span>
      </Link>
    </div>
  );
};

export default NavigationButtons;
