import { tokyoNight } from './tokyo-night';
import { gruvboxDark, gruvboxLight } from './gruvbox';
import { oneDark } from './one-dark';
// Theme registry
var themes = {
    'tokyo-night': tokyoNight,
    'gruvbox-dark': gruvboxDark,
    'gruvbox-light': gruvboxLight,
    'one-dark': oneDark
};
export var getTheme = function (name) {
    if (!(name in themes)) {
        console.warn("Theme \"".concat(name, "\" not found, falling back to Tokyo Night"));
        return themes['tokyo-night'];
    }
    return themes[name];
};
export var getAvailableThemes = function () {
    return Object.values(themes).map(function (theme) { return theme.metadata; });
};
export var getDefaultTheme = function () {
    return themes['tokyo-night'];
};
// Helper to determine if a theme name exists
export var isValidTheme = function (name) {
    return name in themes;
};
// Export individual themes
export { tokyoNight, gruvboxDark, gruvboxLight, oneDark };
