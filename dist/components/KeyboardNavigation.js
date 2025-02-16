'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useEffect, useState, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/navigation';
export var KeyboardNavigation = function (_a) {
    var _b;
    var child = _a.children, navigationItems = _a.navigationItems;
    var router = useRouter();
    var _c = useState({
        currentIndex: 0,
        items: navigationItems
    }), navState = _c[0], setNavState = _c[1];
    // Update navigation state when items change
    useEffect(function () {
        setNavState(function (prev) { return (__assign(__assign({}, prev), { items: navigationItems, currentIndex: Math.min(prev.currentIndex, navigationItems.length - 1) })); });
    }, [navigationItems]);
    var navigateToItem = useCallback(function (index) {
        var element = document.querySelector("[data-nav-item=\"".concat(index, "\"]"));
        element === null || element === void 0 ? void 0 : element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setNavState(function (prev) { return (__assign(__assign({}, prev), { currentIndex: index })); });
    }, []);
    // Smooth scrolling with j/k
    useHotkeys('j', function () {
        window.scrollBy({
            top: 100,
            behavior: 'smooth'
        });
    }, { enableOnFormTags: false });
    useHotkeys('k', function () {
        window.scrollBy({
            top: -100,
            behavior: 'smooth'
        });
    }, { enableOnFormTags: false });
    // Navigation with Shift+J/K
    useHotkeys('shift+j', function () {
        setNavState(function (prev) {
            var newIndex = Math.min(prev.currentIndex + 1, prev.items.length - 1);
            navigateToItem(newIndex);
            return __assign(__assign({}, prev), { currentIndex: newIndex });
        });
    }, { enableOnFormTags: false });
    useHotkeys('shift+k', function () {
        setNavState(function (prev) {
            var newIndex = Math.max(prev.currentIndex - 1, 0);
            navigateToItem(newIndex);
            return __assign(__assign({}, prev), { currentIndex: newIndex });
        });
    }, { enableOnFormTags: false });
    // Track last key press for 'gg' command
    var _d = useState(null), lastKeyPress = _d[0], setLastKeyPress = _d[1];
    var _e = useState(0), lastKeyPressTime = _e[0], setLastKeyPressTime = _e[1];
    // Quick navigation - top/bottom of article and first/last post
    useHotkeys('g', function () {
        var currentTime = Date.now();
        if (lastKeyPress === 'g' && currentTime - lastKeyPressTime < 500) {
            // Double 'g' press within 500ms
            if (window.location.pathname.includes('/posts/')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            else {
                navigateToItem(0);
                setNavState(function (prev) { return (__assign(__assign({}, prev), { currentIndex: 0 })); });
            }
            setLastKeyPress(null); // Reset after handling
        }
        else {
            setLastKeyPress('g');
            setLastKeyPressTime(currentTime);
        }
    }, { enableOnFormTags: false });
    useHotkeys('shift+g', function () {
        // If we're in a post view (URL contains /posts/), scroll to bottom
        if (window.location.pathname.includes('/posts/')) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
        else {
            // Otherwise navigate to last post
            var lastIndex_1 = navigationItems.length - 1;
            navigateToItem(lastIndex_1);
            setNavState(function (prev) { return (__assign(__assign({}, prev), { currentIndex: lastIndex_1 })); });
        }
    }, { enableOnFormTags: false });
    // Next/Previous with n/N
    useHotkeys('n', function () {
        setNavState(function (prev) {
            var newIndex = Math.min(prev.currentIndex + 1, prev.items.length - 1);
            navigateToItem(newIndex);
            return __assign(__assign({}, prev), { currentIndex: newIndex });
        });
    }, { enableOnFormTags: false });
    useHotkeys('shift+n', function () {
        setNavState(function (prev) {
            var newIndex = Math.max(prev.currentIndex - 1, 0);
            navigateToItem(newIndex);
            return __assign(__assign({}, prev), { currentIndex: newIndex });
        });
    }, { enableOnFormTags: false });
    // Home navigation
    useHotkeys('h', function () {
        router.push('/');
    }, { enableOnFormTags: false });
    // Enter to navigate
    useHotkeys('enter', function () {
        var currentItem = navState.items[navState.currentIndex];
        if (currentItem) {
            router.push(currentItem.href);
        }
    }, { enableOnFormTags: false });
    // Update ARIA attributes and focus management
    useEffect(function () {
        var elements = document.querySelectorAll('[data-nav-item]');
        elements.forEach(function (el, index) {
            el.setAttribute('aria-selected', (index === navState.currentIndex).toString());
            el.setAttribute('tabindex', index === navState.currentIndex ? '0' : '-1');
            if (index === navState.currentIndex) {
                el.classList.add('nav-focus-indicator');
                // Only focus if the element is visible
                var rect = el.getBoundingClientRect();
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    el.focus({ preventScroll: true });
                }
            }
            else {
                el.classList.remove('nav-focus-indicator');
            }
        });
    }, [navState.currentIndex]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "sr-only", role: "status", "aria-live": "polite" },
            "Currently selected: ", (_b = navState.items[navState.currentIndex]) === null || _b === void 0 ? void 0 :
            _b.label),
        React.createElement("div", { className: "sr-only", role: "complementary" },
            React.createElement("p", null, "Keyboard Navigation Instructions:"),
            React.createElement("ul", null,
                React.createElement("li", null, "Use J and K to scroll the article up and down"),
                React.createElement("li", null, "Use Shift+J and Shift+K or N and Shift+N to navigate between posts"),
                React.createElement("li", null, "Press Enter to view the selected post"),
                React.createElement("li", null, "Use gg to scroll to top of article (in post view) or go to first post (in list view)"),
                React.createElement("li", null, "Use Shift+G to scroll to bottom of article (in post view) or go to last post (in list view)"),
                React.createElement("li", null, "Press H to return to the home page"))),
        React.cloneElement(child, {
            className: child.props.className
        })));
};
export default KeyboardNavigation;
