import type { Theme, ThemeName } from '@/types/theme';
import { tokyoNight } from './tokyo-night';
import { gruvboxDark, gruvboxLight } from './gruvbox';
import { oneDark } from './one-dark';
export declare const getTheme: (name: ThemeName) => Theme;
export declare const getAvailableThemes: () => import("@/types/theme").ThemeMetadata[];
export declare const getDefaultTheme: () => Theme;
export declare const isValidTheme: (name: string) => name is ThemeName;
export { tokyoNight, gruvboxDark, gruvboxLight, oneDark };
