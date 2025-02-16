"use client";
import React from 'react';
import Link from 'next/link';
export var NavigationButtons = function (_a) {
    var previous = _a.previous, next = _a.next;
    return (React.createElement("div", { className: "flex flex-row gap-4 mb-4 justify-center w-full min-w-[200px]" },
        React.createElement(Link, { href: previous ? "/posts/".concat(previous.slug) : '#', className: "px-4 py-2 text-[var(--link)] bg-[var(--background)] border border-[var(--border)] rounded flex items-center min-w-[120px] ".concat(!previous ? 'opacity-50 pointer-events-none' : 'hover:bg-[var(--selection)]', " transition-colors"), "aria-disabled": !previous, tabIndex: previous ? 0 : -1 },
            React.createElement("span", { className: "text-xl mr-2" }, "\u2190"),
            React.createElement("span", null, "Previous")),
        React.createElement(Link, { href: next ? "/posts/".concat(next.slug) : '#', className: "px-4 py-2 text-[var(--link)] bg-[var(--background)] border border-[var(--border)] rounded flex items-center justify-end min-w-[120px] ".concat(!next ? 'opacity-50 pointer-events-none' : 'hover:bg-[var(--selection)]', " transition-colors"), "aria-disabled": !next, tabIndex: next ? 0 : -1 },
            React.createElement("span", null, "Next"),
            React.createElement("span", { className: "text-xl ml-2" }, "\u2192"))));
};
export default NavigationButtons;
