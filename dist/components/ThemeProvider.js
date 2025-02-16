'use client';
import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { tokyoNight, gruvboxDark, gruvboxLight, oneDark } from '@/themes';
import styles from '@/styles/theme.module.css';
var themes = {
    'tokyo-night': tokyoNight,
    'gruvbox-dark': gruvboxDark,
    'gruvbox-light': gruvboxLight,
    'one-dark': oneDark,
};
var getInitialTheme = function () {
    if (typeof window === 'undefined')
        return tokyoNight;
    try {
        var stored = localStorage.getItem('preferred-theme');
        if (stored && stored in themes)
            return themes[stored];
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemDark ? tokyoNight : gruvboxLight;
    }
    catch (_a) {
        return tokyoNight;
    }
};
var applyTheme = function (theme) {
    var root = document.documentElement;
    root.setAttribute('data-theme', theme.metadata.name);
    Object.entries(theme.palette).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        root.style.setProperty("--".concat(key), value);
        // Also set the theme- prefixed version for backward compatibility
        root.style.setProperty("--theme-".concat(key), value);
    });
};
// Create theme context
var ThemeContext = createContext(null);
// Custom hook to use theme context
export var useThemeContext = function () {
    var context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
export function ThemeProvider(_a) {
    var children = _a.children;
    var _b = useState(getInitialTheme), currentTheme = _b[0], setCurrentTheme = _b[1];
    var _c = useState(false), isInitialized = _c[0], setIsInitialized = _c[1];
    // Apply theme on mount and handle system preference changes
    useLayoutEffect(function () {
        applyTheme(currentTheme);
        setIsInitialized(true);
        // Add theme-loaded class after initialization
        document.documentElement.classList.add('theme-loaded');
        var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        var handleChange = function (e) {
            if (!localStorage.getItem('preferred-theme')) {
                var newTheme = e.matches ? tokyoNight : gruvboxLight;
                setCurrentTheme(newTheme);
                applyTheme(newTheme);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return function () { return mediaQuery.removeEventListener('change', handleChange); };
    }, [currentTheme]);
    var setTheme = function (themeName) {
        var newTheme = themes[themeName];
        setCurrentTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('preferred-theme', themeName);
    };
    if (!isInitialized) {
        return React.createElement("div", { style: { visibility: 'hidden' } }, children);
    }
    return (React.createElement(ThemeContext.Provider, { value: {
            currentTheme: currentTheme,
            setTheme: setTheme,
            isDark: currentTheme.metadata.isDark,
            availableThemes: Object.values(themes).map(function (theme) { return theme.metadata; })
        } },
        React.createElement(React.Fragment, null,
            children,
            React.createElement("div", { className: styles.themeSelector },
                React.createElement("div", { className: styles.themePreview, style: { backgroundColor: currentTheme.palette.background } }),
                React.createElement("select", { value: currentTheme.metadata.name, onChange: function (e) { return setTheme(e.target.value); }, className: styles.themeSelect, "aria-label": "Select theme" }, Object.values(themes).map(function (theme) { return (React.createElement("option", { key: theme.metadata.name, value: theme.metadata.name }, theme.metadata.displayName)); }))))));
}
