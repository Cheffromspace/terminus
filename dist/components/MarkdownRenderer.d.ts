import React from 'react';
import 'highlight.js/styles/tokyo-night-dark.css';
import type { SeriesData } from '@/types/blog';
interface FrontmatterData {
    title?: string;
    date?: string | Date;
    description?: string;
    series?: SeriesData;
    draft?: boolean;
    excerpt?: string;
    [key: string]: string | Date | boolean | SeriesData | undefined;
}
interface MarkdownRendererProps {
    content: string;
    frontmatter?: FrontmatterData;
    className?: string;
}
export declare function MarkdownRenderer({ content, frontmatter, className }: MarkdownRendererProps): React.ReactElement;
export {};
