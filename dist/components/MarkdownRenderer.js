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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import mermaid from 'mermaid';
import 'highlight.js/styles/tokyo-night-dark.css';
// Custom rehype plugin to transform HTML event handlers
function rehypeTransformEvents() {
    return function (tree) {
        visit(tree, 'element', function (node) {
            var props = node.properties || {};
            // Convert onclick to onClick
            if ('onclick' in props) {
                var onClickStr = props.onclick;
                delete props.onclick;
                props.onClick = onClickStr;
            }
        });
    };
}
// Mermaid renderer component
function MermaidRenderer(_a) {
    var chart = _a.chart;
    var elementRef = useRef(null);
    var chartId = useRef("mermaid-".concat(Math.random().toString(36).substr(2, 9)));
    useEffect(function () {
        if (elementRef.current) {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                securityLevel: 'loose',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            });
            try {
                mermaid.render(chartId.current, chart).then(function (_a) {
                    var svg = _a.svg;
                    if (elementRef.current) {
                        elementRef.current.innerHTML = svg;
                    }
                });
            }
            catch (error) {
                console.error('Mermaid rendering error:', error);
                if (elementRef.current) {
                    elementRef.current.innerHTML = 'Error rendering diagram';
                }
            }
        }
    }, [chart]);
    return (React.createElement("div", { ref: elementRef, className: "my-4 p-4 bg-[rgb(30,41,59)] rounded-lg overflow-auto" }));
}
// Custom rehype plugin to add language display
function rehypeCodeLanguage() {
    return function (tree) {
        var visitor = function (node, index, parent) {
            var _a, _b, _c, _d;
            if (node.tagName === 'pre' &&
                ((_b = (_a = node.children) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type) === 'element' &&
                node.children[0].tagName === 'code') {
                var codeNode = node.children[0];
                var className = ((_c = codeNode.properties) === null || _c === void 0 ? void 0 : _c.className) || [];
                var language = (_d = className.find(function (cls) {
                    return cls.startsWith('language-');
                })) === null || _d === void 0 ? void 0 : _d.replace('language-', '');
                if (language && parent && typeof index === 'number') {
                    // Create language label
                    var languageLabel = {
                        type: 'element',
                        tagName: 'div',
                        properties: { className: ['code-language'] },
                        children: [{ type: 'text', value: language }]
                    };
                    // Create wrapper
                    var wrapper = {
                        type: 'element',
                        tagName: 'div',
                        properties: { className: ['code-block-wrapper'] },
                        children: [languageLabel, node]
                    };
                    // Replace the original node with our wrapper
                    parent.children[index] = wrapper;
                }
            }
        };
        visit(tree, 'element', visitor);
    };
}
export function MarkdownRenderer(_a) {
    var content = _a.content, frontmatter = _a.frontmatter, _b = _a.className, className = _b === void 0 ? '' : _b;
    var codeBlockStyle = "\n    .code-block-wrapper {\n      position: relative;\n      max-width: fit-content;\n    }\n    .code-language {\n      position: absolute;\n      top: 0;\n      left: 0;\n      background-color: rgb(40, 51, 69);\n      color: #94a3b8;\n      font-size: 0.75rem;\n      padding: 0.25rem 0.75rem;\n      border-bottom-right-radius: 0.375rem;\n      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n    }\n    .hljs {\n      background-color: rgb(30, 41, 59) !important;\n    }\n  ";
    var components = {
        h1: function (_a) {
            var _b;
            var children = _a.children, props = __rest(_a, ["children"]);
            // Skip h1 headings in content since we show title in frontmatter
            var text = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
            if (((_b = frontmatter === null || frontmatter === void 0 ? void 0 : frontmatter.title) === null || _b === void 0 ? void 0 : _b.replace(/^"|"$/g, '')) === text) {
                return null;
            }
            return React.createElement("h1", __assign({}, props), children);
        },
        div: function (_a) {
            var children = _a.children, style = _a.style, props = __rest(_a, ["children", "style"]);
            // Handle custom styled box
            if ((style === null || style === void 0 ? void 0 : style.backgroundColor) === '#f0f0f0') {
                return (React.createElement("div", __assign({}, props, { style: __assign(__assign({}, style), { backgroundColor: 'hsl(235, 24%, 20%)', color: 'hsl(227, 30%, 95%)', padding: '20px', borderRadius: '5px', border: '1px solid hsl(234, 23%, 25%)' }) }), children));
            }
            // Handle grid container
            if ((style === null || style === void 0 ? void 0 : style.display) === 'grid') {
                return (React.createElement("div", __assign({}, props, { style: __assign(__assign({}, style), { gap: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }) }), children));
            }
            // Handle grid items
            if ((style === null || style === void 0 ? void 0 : style.background) === '#e0e0e0') {
                return (React.createElement("div", __assign({}, props, { style: {
                        backgroundColor: 'hsl(235, 24%, 20%)',
                        color: 'hsl(227, 30%, 95%)',
                        padding: '15px',
                        borderRadius: '4px',
                        border: '1px solid hsl(234, 23%, 25%)'
                    } }), children));
            }
            return React.createElement("div", __assign({}, props, { style: style }), children);
        },
        h2: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("h2", __assign({}, props), children);
        },
        h3: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("h3", __assign({}, props), children);
        },
        h4: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("h4", __assign({}, props), children);
        },
        p: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("p", __assign({}, props), children);
        },
        pre: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("pre", __assign({}, props), children);
        },
        table: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("table", __assign({}, props), children);
        },
        thead: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("thead", __assign({}, props), children);
        },
        tbody: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("tbody", __assign({}, props), children);
        },
        tr: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("tr", __assign({}, props), children);
        },
        th: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("th", __assign({}, props), children);
        },
        td: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("td", __assign({}, props), children);
        },
        code: function (_a) {
            var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
            var match = /language-(\w+)/.exec(className || '');
            var language = match ? match[1] : '';
            if (language === 'mermaid') {
                return React.createElement(MermaidRenderer, { chart: String(children) });
            }
            return (React.createElement("code", __assign({ className: match ? "".concat(className, " ").concat(match[1]) : className }, props), children));
        },
        ul: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("ul", __assign({}, props), children);
        },
        ol: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("ol", __assign({}, props), children);
        },
        li: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("li", __assign({}, props), children);
        },
        blockquote: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("blockquote", __assign({}, props), children);
        },
        a: function (_a) {
            var children = _a.children, href = _a.href, props = __rest(_a, ["children", "href"]);
            return (React.createElement("a", __assign({ href: href, target: (href === null || href === void 0 ? void 0 : href.startsWith('http')) ? '_blank' : undefined, rel: (href === null || href === void 0 ? void 0 : href.startsWith('http')) ? 'noopener noreferrer' : undefined }, props), children));
        },
        em: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("em", __assign({}, props), children);
        },
        strong: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("strong", __assign({}, props), children);
        },
        hr: function (_a) {
            var props = __rest(_a, []);
            return React.createElement("hr", __assign({}, props));
        },
        button: function (_a) {
            var children = _a.children, onClick = _a.onClick, style = _a.style, props = __rest(_a, ["children", "onClick", "style"]);
            // Handle onClick string from HTML
            var handleClick = typeof onClick === 'string'
                ? function () {
                    var fn = new Function(onClick);
                    fn();
                }
                : onClick;
            // Override button styles
            if ((style === null || style === void 0 ? void 0 : style.backgroundColor) === '#007bff') {
                return (React.createElement("button", __assign({ onClick: handleClick }, props, { style: {
                        backgroundColor: 'hsl(217, 92%, 35%)',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                    }, onMouseOver: function (e) {
                        e.currentTarget.style.backgroundColor = 'hsl(217, 92%, 40%)';
                    }, onMouseOut: function (e) {
                        e.currentTarget.style.backgroundColor = 'hsl(217, 92%, 35%)';
                    } }), children));
            }
            return (React.createElement("button", __assign({ onClick: handleClick }, props, { style: style }), children));
        }
    };
    return (React.createElement(React.Fragment, null,
        frontmatter && (React.createElement("div", { className: "mb-12" },
            React.createElement("div", { className: "frontmatter-block rounded-lg bg-[var(--code-background)] border border-[var(--border-color)] border-l-4 border-l-[var(--accent-color)] p-6 font-mono" },
                React.createElement("div", { className: "grid gap-6" },
                    React.createElement("div", { className: "frontmatter-field" },
                        React.createElement("div", { className: "text-[var(--accent-color)] font-bold capitalize text-sm tracking-wide mb-2" }, "Title"),
                        React.createElement("div", { className: "text-[var(--foreground)] text-base leading-relaxed bg-[var(--background)] p-4 rounded-md border border-[var(--border-color)] shadow-sm font-sans" }, typeof frontmatter.title === 'string' ? frontmatter.title.replace(/^"|"$/g, '') : '')),
                    frontmatter.date && (React.createElement("div", { className: "frontmatter-field" },
                        React.createElement("div", { className: "text-[var(--accent-color)] font-bold capitalize text-sm tracking-wide mb-2" }, "Date"),
                        React.createElement("div", { className: "text-[var(--foreground)] text-base leading-relaxed bg-[var(--background)] p-4 rounded-md border border-[var(--border-color)] shadow-sm font-sans" }, new Intl.DateTimeFormat('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).format(new Date(String(frontmatter.date)))))))))),
        React.createElement("div", { className: "prose prose-invert max-w-none ".concat(className) },
            React.createElement("style", null, codeBlockStyle),
            React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw, rehypeTransformEvents, rehypeCodeLanguage, rehypeHighlight], components: components }, content))));
}
