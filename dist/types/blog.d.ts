export interface SeriesData {
    name: string;
    order: number;
    totalParts?: number;
}
export interface Post {
    id: string;
    title: string;
    slug: string;
    date: string;
    publishDate?: string;
    content: string;
    description: string;
    draft: boolean;
    excerpt?: string;
    tags?: string[];
    series?: SeriesData;
}
export interface Series {
    name: string;
    posts: Post[];
}
export interface NavigationState {
    currentIndex: number;
    items: Array<{
        id: string;
        href: string;
        label: string;
    }>;
}
export type NavigationChild = React.ReactElement<{
    className?: string;
}>;
export interface KeyboardNavigationProps {
    children: NavigationChild;
    navigationItems: NavigationState['items'];
}
export type ColorScheme = 'tokyo-night' | 'gruvbox' | 'one-dark';
