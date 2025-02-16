import type { Theme, ThemeName } from '@/types/theme';
export declare const useTheme: () => {
    currentTheme: Theme;
    setTheme: (themeName: ThemeName) => void;
    isLoading: boolean;
    availableThemes: import("@/types/theme").ThemeMetadata[];
    isDark: boolean;
};
