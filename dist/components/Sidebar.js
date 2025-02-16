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
import React, { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FixedSizeList as List } from 'react-window';
import { KeyboardNavigation } from '@/components/KeyboardNavigation';
var ITEM_HEIGHT = 64; // Height for each post item
var ITEM_PADDING = 8; // Padding between items
var PostItem = React.memo(function (_a) {
    var data = _a.data, index = _a.index, style = _a.style;
    var posts = data.posts, currentPost = data.currentPost, onItemFocus = data.onItemFocus;
    var post = posts[index];
    var isSelected = currentPost.slug === post.slug;
    return (React.createElement(Link, { key: post.slug, href: "/posts/".concat(post.slug), "data-nav-item": index, role: "option", "aria-selected": isSelected, onFocus: function () { return onItemFocus(index); }, className: "block px-3 py-2 text-sm rounded-md transition-colors duration-150 min-h-[".concat(ITEM_HEIGHT, "px] focus:outline-none focus:ring-2 focus:ring-[var(--link)] focus-visible:ring-2 focus-visible:ring-[var(--link)] ").concat(isSelected
            ? 'bg-[var(--selection)] text-[var(--foreground)] shadow-sm font-medium'
            : 'hover:bg-[var(--background-muted)]'), style: __assign(__assign({}, style), { top: "".concat(parseFloat(style.top) + ITEM_PADDING, "px"), contain: 'content' }) },
        React.createElement("span", { className: "line-clamp-2" },
            post.title,
            post.series && (React.createElement("span", { className: "block text-xs text-[var(--comment)] mt-0.5" },
                post.series.name,
                " - Part ",
                post.series.order,
                " of ",
                post.series.totalParts)))));
});
PostItem.displayName = 'PostItem';
export var Sidebar = function (_a) {
    var currentPost = _a.currentPost, allPosts = _a.allPosts, className = _a.className, _b = _a.defaultVisible, defaultVisible = _b === void 0 ? true : _b, onVisibilityChange = _a.onVisibilityChange;
    var _c = useState(false), isHelpVisible = _c[0], setIsHelpVisible = _c[1];
    var _d = useState(defaultVisible), isSidebarVisible = _d[0], setIsSidebarVisible = _d[1];
    useEffect(function () {
        onVisibilityChange === null || onVisibilityChange === void 0 ? void 0 : onVisibilityChange(isSidebarVisible);
    }, [isSidebarVisible, onVisibilityChange]);
    var _e = useState(''), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = useState(false), isSearching = _f[0], setIsSearching = _f[1];
    var listRef = useRef(null);
    var searchInputRef = useRef(null);
    var filteredPosts = useMemo(function () {
        if (!searchQuery)
            return allPosts;
        var query = searchQuery.toLowerCase();
        return allPosts.filter(function (post) {
            var _a;
            return post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                ((_a = post.series) === null || _a === void 0 ? void 0 : _a.name.toLowerCase().includes(query));
        });
    }, [allPosts, searchQuery]);
    var navigationItems = useMemo(function () {
        return filteredPosts.map(function (post) { return ({
            id: post.slug,
            label: post.title,
            href: "/posts/".concat(post.slug),
        }); });
    }, [filteredPosts]);
    var handleItemFocus = function (index) {
        var _a;
        (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToItem(index, 'smart');
    };
    // Scroll to current post when it changes
    useEffect(function () {
        var _a;
        var currentIndex = filteredPosts.findIndex(function (post) { return post.slug === currentPost.slug; });
        if (currentIndex !== -1) {
            (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToItem(currentIndex, 'smart');
        }
    }, [currentPost.slug, filteredPosts]);
    // Keyboard shortcuts
    useEffect(function () {
        var handleKeyPress = function (e) {
            var _a, _b;
            // Don't trigger shortcuts if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            if (e.key === '?' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                setIsHelpVisible(function (prev) { return !prev; });
            }
            if (e.key === '`' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                setIsSidebarVisible(function (prev) { return !prev; });
            }
            if (e.key === '/' && !isSearching) {
                e.preventDefault();
                setIsSearching(true);
                (_a = searchInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
            if (e.key === 'Escape') {
                if (isSearching) {
                    e.preventDefault();
                    setIsSearching(false);
                    setSearchQuery('');
                    (_b = searchInputRef.current) === null || _b === void 0 ? void 0 : _b.blur();
                }
                else if (isHelpVisible) {
                    setIsHelpVisible(false);
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return function () { return window.removeEventListener('keydown', handleKeyPress); };
    }, [isSearching, isHelpVisible]);
    var currentIndex = filteredPosts.findIndex(function (post) { return post.slug === currentPost.slug; });
    var sidebarContent = (React.createElement("nav", { className: "fixed left-0 top-0 h-screen w-72 bg-[var(--background)] border-r border-[var(--border)] transform transition-transform duration-150 ease-out ".concat(isSidebarVisible ? 'translate-x-0' : '-translate-x-72', " ").concat(className || ''), "aria-label": "Blog navigation" },
        React.createElement("a", { href: "#main-content", className: "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--background)] focus:ring-2 focus:ring-[var(--link)]" }, "Skip to main content"),
        React.createElement("button", { onClick: function () { return setIsSidebarVisible(function (prev) { return !prev; }); }, className: "fixed left-72 top-4 p-2 bg-[var(--background)] border border-[var(--border)] rounded-r-lg shadow-sm hover:bg-[var(--selection)] transition-colors duration-150 z-10", "aria-label": "".concat(isSidebarVisible ? 'Hide' : 'Show', " sidebar (Press ` to toggle)") },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "transform transition-transform duration-150 ".concat(isSidebarVisible ? 'rotate-0' : 'rotate-180') },
                React.createElement("path", { d: "M15 18l-6-6 6-6" }))),
        React.createElement("div", { className: "h-full flex flex-col p-6" },
            React.createElement("div", { className: "relative mb-4" },
                React.createElement("input", { ref: searchInputRef, type: "search", placeholder: "Search posts... (Press / to focus)", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, onBlur: function () { return setIsSearching(false); }, className: "w-full px-3 py-2 text-sm bg-[var(--background-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--link)] text-[var(--foreground)]", "aria-label": "Search posts" }),
                searchQuery && (React.createElement("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--comment)]" },
                    filteredPosts.length,
                    " results"))),
            React.createElement("div", { className: "flex-1 min-h-0" },
                React.createElement("h3", { className: "text-sm font-semibold mb-3 text-[var(--comment)] uppercase tracking-wider flex items-center justify-between" },
                    React.createElement("span", null, "All Posts"),
                    React.createElement("button", { onClick: function () { return setIsHelpVisible(true); }, className: "text-xs font-normal normal-case text-[var(--comment)] hover:text-[var(--foreground)]", "aria-label": "Show keyboard shortcuts" }, "? Help")),
                React.createElement("div", { role: "listbox", "aria-label": "Blog posts", className: "h-full", tabIndex: 0 },
                    React.createElement(List, { ref: listRef, height: 600, itemCount: filteredPosts.length, itemSize: ITEM_HEIGHT + ITEM_PADDING, width: "100%", itemData: {
                            posts: filteredPosts,
                            currentPost: currentPost,
                            onItemFocus: handleItemFocus,
                        } }, PostItem)))),
        React.createElement("div", { className: "sr-only", role: "status", "aria-live": "polite" }, searchQuery ? "".concat(filteredPosts.length, " posts found") : "".concat(currentPost.title, " - ").concat(currentIndex + 1, " of ").concat(filteredPosts.length, " posts"))));
    return (React.createElement(React.Fragment, null,
        React.createElement(KeyboardNavigation, { navigationItems: navigationItems }, sidebarContent),
        isHelpVisible && (React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" },
            React.createElement("div", { className: "bg-[var(--background)] p-6 rounded-lg max-w-md w-full mx-4 shadow-xl border border-[var(--border)]", role: "dialog", "aria-label": "Keyboard shortcuts" },
                React.createElement("h2", { className: "text-lg font-semibold mb-4 text-[var(--foreground)]" }, "Keyboard Shortcuts"),
                React.createElement("dl", { className: "space-y-2 text-[var(--foreground)]" },
                    React.createElement("div", { className: "flex justify-between" },
                        React.createElement("dt", { className: "font-mono" }, "Shift + J/K"),
                        React.createElement("dd", null, "Navigate posts")),
                    React.createElement("div", { className: "flex justify-between" },
                        React.createElement("dt", { className: "font-mono" }, "Enter"),
                        React.createElement("dd", null, "Open selected post")),
                    React.createElement("div", { className: "flex justify-between" },
                        React.createElement("dt", { className: "font-mono" }, "g g"),
                        React.createElement("dd", null, "Go to first post")),
                    React.createElement("div", { className: "flex justify-between" },
                        React.createElement("dt", { className: "font-mono" }, "Shift + G"),
                        React.createElement("dd", null, "Go to last post")),
                    React.createElement("div", { className: "flex justify-between" },
                        React.createElement("dt", { className: "font-mono" }, "/"),
                        React.createElement("dd", null, "Search posts (Esc to clear)")),
                    React.createElement("div", { className: "flex justify-between" },
                        React.createElement("dt", { className: "font-mono" }, "`"),
                        React.createElement("dd", null, "Toggle sidebar")),
                    React.createElement("div", { className: "flex justify-between" },
                        React.createElement("dt", { className: "font-mono" }, "?"),
                        React.createElement("dd", null, "Show/hide this help"))),
                React.createElement("button", { onClick: function () { return setIsHelpVisible(false); }, className: "mt-4 w-full px-4 py-2 bg-[var(--link)] text-[var(--background)] rounded-lg hover:opacity-90 transition-colors duration-150" }, "Close"))))));
};
export default Sidebar;
