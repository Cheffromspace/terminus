import React from 'react';
import type { Post } from '@/types/blog';
interface SidebarProps {
    currentPost: Post;
    allPosts: Post[];
    className?: string;
    defaultVisible?: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}
export declare const Sidebar: React.FC<SidebarProps>;
export default Sidebar;
