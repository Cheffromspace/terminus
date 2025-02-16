'use client';
import React from 'react';
import Link from 'next/link';
export var HomeButton = function () {
    return (React.createElement(Link, { href: "/", className: "fixed bottom-8 right-8 p-3 bg-gray-100 dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", "aria-label": "Return to home page" },
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l-7-7m0 0L5 10m0 0v10a1 1 0 001 1h3" }))));
};
export default HomeButton;
