'use client';

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import mermaid from 'mermaid';
import 'highlight.js/styles/tokyo-night-dark.css';
import type { Components } from 'react-markdown';
import type { Root, Element } from 'hast';
import type { Visitor } from 'unist-util-visit';
import type { SeriesData } from '@/types/blog';

// Custom rehype plugin to transform HTML event handlers
function rehypeTransformEvents() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const props = node.properties || {};
      
      // Convert onclick to onClick
      if ('onclick' in props) {
        const onClickStr = props.onclick as string;
        delete props.onclick;
        props.onClick = onClickStr;
      }
    });
  };
}

interface FrontmatterData {
  title?: string;
  date?: string | Date;
  description?: string;
  series?: SeriesData;
  draft?: boolean;
  excerpt?: string;
  [key: string]: string | Date | boolean | SeriesData | undefined;
}

interface MarkdownRendererProps {
  content: string;
  frontmatter?: FrontmatterData;
  className?: string;
}

// Mermaid renderer component
function MermaidRenderer({ chart }: { chart: string }) {
  const elementRef = useRef<HTMLDivElement>(null);
  // Use a stable ID based on the chart content
  const chartId = useRef(`mermaid-${Buffer.from(chart).toString('base64').slice(0, 8)}`);

  useEffect(() => {
    if (elementRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      });

      try {
        mermaid.render(chartId.current, chart).then(({ svg }) => {
          if (elementRef.current) {
            elementRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = 'Error rendering diagram';
        }
      }
    }
  }, [chart]);

  return (
    <div 
      ref={elementRef}
      className="my-4 p-4 rounded-lg overflow-auto"
      style={{
        backgroundColor: 'var(--background-muted)'
      }}
    />
  );
}

// Custom rehype plugin to add language display
function rehypeCodeLanguage() {
  return (tree: Root) => {
    const visitor: Visitor<Element> = (node, index, parent) => {
      if (
        node.tagName === 'pre' && 
        node.children?.[0]?.type === 'element' &&
        (node.children[0] as Element).tagName === 'code'
      ) {
        const codeNode = node.children[0] as Element;
        const className = (codeNode.properties?.className as string[]) || [];
        const language = className.find((cls: string) => 
          cls.startsWith('language-')
        )?.replace('language-', '');

        if (language && parent && typeof index === 'number') {
          // Create language label
          const languageLabel: Element = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['code-language'] },
            children: [{ type: 'text', value: language }]
          };

          // Create wrapper
          const wrapper: Element = {
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

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, frontmatter, className = '' }): React.ReactElement => {
// Extended sanitize schema to allow specific HTML attributes
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), 'className', 'style'],
    code: [...(defaultSchema.attributes?.code || []), 'className'],
    span: [...(defaultSchema.attributes?.span || []), 'className', 'style'],
    button: [...(defaultSchema.attributes?.button || []), 'onClick', 'style'],
  }
};

  const components: Components = {
    h1({ children, ...props }) {
      // Skip h1 headings in content since we show title in frontmatter
      const text = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
      if (frontmatter?.title?.replace(/^"|"$/g, '') === text) {
        return null;
      }
      return <h1 {...props}>{children}</h1>;
    },
    div({ children, style, ...props }) {
      // Handle custom styled box
      if (style?.backgroundColor === '#f0f0f0') {
        return (
          <div 
            {...props}
            style={{
              ...style,
              backgroundColor: 'var(--background-muted)',
              color: 'var(--foreground)',
              padding: '20px',
              borderRadius: '5px',
              border: '1px solid var(--border)'
            }}
          >
            {children}
          </div>
        );
      }

      // Handle grid container
      if (style?.display === 'grid') {
        return (
          <div 
            {...props}
            style={{
              ...style,
              gap: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
            }}
          >
            {children}
          </div>
        );
      }

      // Handle grid items
      if (style?.background === '#e0e0e0') {
        return (
          <div 
            {...props}
            style={{
              backgroundColor: 'var(--background-muted)',
              color: 'var(--foreground)',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid var(--border)'
            }}
          >
            {children}
          </div>
        );
      }

      return <div {...props} style={style}>{children}</div>;
    },
    h2({ children, ...props }) {
      return <h2 {...props}>{children}</h2>;
    },
    h3({ children, ...props }) {
      return <h3 {...props}>{children}</h3>;
    },
    h4({ children, ...props }) {
      return <h4 {...props}>{children}</h4>;
    },
    p({ children, ...props }) {
      return <p {...props}>{children}</p>;
    },
    pre({ children, ...props }) {
      return <pre {...props}>{children}</pre>;
    },
    table({ children, ...props }) {
      return <table {...props}>{children}</table>;
    },
    thead({ children, ...props }) {
      return <thead {...props}>{children}</thead>;
    },
    tbody({ children, ...props }) {
      return <tbody {...props}>{children}</tbody>;
    },
    tr({ children, ...props }) {
      return <tr {...props}>{children}</tr>;
    },
    th({ children, ...props }) {
      return <th {...props}>{children}</th>;
    },
    td({ children, ...props }) {
      return <td {...props}>{children}</td>;
    },
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (language === 'mermaid') {
        return <MermaidRenderer chart={String(children)} />;
      }
      
      return (
        <code className={match ? `${className} ${match[1]}` : className} {...props}>
          {children}
        </code>
      );
    },
    ul({ children, ...props }) {
      return <ul {...props}>{children}</ul>;
    },
    ol({ children, ...props }) {
      return <ol {...props}>{children}</ol>;
    },
    li({ children, ...props }) {
      return <li {...props}>{children}</li>;
    },
    blockquote({ children, ...props }) {
      return <blockquote {...props}>{children}</blockquote>;
    },
    a({ children, href, ...props }) {
      return (
        <a 
          href={href}
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
    em({ children, ...props }) {
      return <em {...props}>{children}</em>;
    },
    strong({ children, ...props }) {
      return <strong {...props}>{children}</strong>;
    },
    hr({ ...props }) {
      return <hr {...props} />;
    },
    button({ children, onClick, style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
      // Handle onClick string from HTML
      const handleClick = typeof onClick === 'string'
        ? () => {
            const fn = new Function(onClick);
            fn();
          }
        : onClick;

      // Use CSS class for primary button styles
      if (style?.backgroundColor === '#007bff') {
        return (
          <button 
            onClick={handleClick} 
            {...props}
            className="primary-button"
          >
            {children}
          </button>
        );
      }

      return (
        <button onClick={handleClick} {...props} style={style}>
          {children}
        </button>
      );
    }
  };

  return (
    <>
      {frontmatter && (
        <div className="mb-12">
          <div className="frontmatter-block rounded-lg bg-[var(--code-background)] border border-[var(--border-color)] border-l-4 border-l-[var(--accent-color)] p-6 font-mono">
            <div className="grid gap-6">
              {/* Title */}
              <div className="frontmatter-field">
                <div className="text-[var(--accent-color)] font-bold capitalize text-sm tracking-wide mb-2">
                  Title
                </div>
                <div className="text-[var(--foreground)] text-base leading-relaxed bg-[var(--background)] p-4 rounded-md border border-[var(--border-color)] shadow-sm font-sans">
                  {typeof frontmatter.title === 'string' ? frontmatter.title.replace(/^"|"$/g, '') : ''}
                </div>
              </div>
              
              {/* Date */}
              {frontmatter.date && (
                <div className="frontmatter-field">
                  <div className="text-[var(--accent-color)] font-bold capitalize text-sm tracking-wide mb-2">
                    Date
                  </div>
                  <div className="text-[var(--foreground)] text-base leading-relaxed bg-[var(--background)] p-4 rounded-md border border-[var(--border-color)] shadow-sm font-sans">
                    {/* Ensure consistent date formatting between server and client */}
                    {(() => {
                      const date = new Date(String(frontmatter.date));
                      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className={`prose ${className} markdown-content`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            [rehypeSanitize, sanitizeSchema],
            rehypeTransformEvents,
            rehypeCodeLanguage,
            rehypeHighlight
          ]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default MarkdownRenderer;
