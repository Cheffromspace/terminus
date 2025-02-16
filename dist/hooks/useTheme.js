import { useState, useCallback, useLayoutEffect } from 'react';
import { getTheme, getDefaultTheme, isValidTheme, getAvailableThemes } from '@/themes';
var THEME_STORAGE_KEY = 'preferred-theme';
// Get initial theme synchronously to prevent hydration mismatch
var getInitialTheme = function () {
    if (typeof window === 'undefined')
        return getDefaultTheme();
    try {
        var stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored && isValidTheme(stored)) {
            return getTheme(stored);
        }
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return getTheme(systemDark ? 'tokyo-night' : 'gruvbox-light');
    }
    catch (_a) {
        return getDefaultTheme();
    }
};
export var useTheme = function () {
    var _a = useState(getInitialTheme), currentTheme = _a[0], setCurrentTheme = _a[1];
    var isLoading = useState(false)[0];
    // Apply theme to document
    var applyTheme = useCallback(function (theme) {
        var root = document.documentElement;
        var palette = theme.palette;
        // Apply theme variables
        Object.entries(palette).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            root.style.setProperty("--theme-".concat(key), value);
        });
        // Update theme metadata
        root.setAttribute('data-theme', theme.metadata.name);
        root.setAttribute('data-theme-dark', theme.metadata.isDark.toString());
    }, []);
    // Handle theme change
    var setTheme = useCallback(function (themeName) {
        var theme = getTheme(themeName);
        setCurrentTheme(theme);
        applyTheme(theme);
        localStorage.setItem(THEME_STORAGE_KEY, themeName);
    }, [applyTheme]);
    // Sync with system preferences
    useLayoutEffect(function () {
        // Apply theme immediately
        applyTheme(currentTheme);
        // Listen for system theme changes
        var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        var handleChange = function (e) {
            if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                var newTheme = getTheme(e.matches ? 'tokyo-night' : 'gruvbox-light');
                setCurrentTheme(newTheme);
                applyTheme(newTheme);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return function () { return mediaQuery.removeEventListener('change', handleChange); };
    }, [currentTheme, applyTheme]);
    return {
        currentTheme: currentTheme,
        setTheme: setTheme,
        isLoading: isLoading,
        availableThemes: getAvailableThemes(),
        isDark: currentTheme.metadata.isDark
    };
};
