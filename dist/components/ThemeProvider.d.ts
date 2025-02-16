import React from 'react';
import type { ThemeContextValue } from '@/types/theme';
export declare const useThemeContext: () => ThemeContextValue;
export declare function ThemeProvider({ children, }: {
    children: React.ReactNode;
}): React.ReactElement;
