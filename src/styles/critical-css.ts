export const criticalCSS = `@tailwind base;

/* Critical CSS for immediate render */
@layer base {
  :root {
    /* Layout variables */
    --sidebar-width: 16rem;
    --sidebar-visible: 1;
    color-scheme: light dark;

    /* Theme transition timing */
    --theme-transition-duration: 200ms;
    --theme-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Theme transition properties */
    --theme-transition-props: background-color var(--theme-transition-duration) var(--theme-transition-timing),
                            border-color var(--theme-transition-duration) var(--theme-transition-timing),
                            box-shadow var(--theme-transition-duration) var(--theme-transition-timing);
  }

  /* Core styles */
  body {
    min-height: 100vh;
    color: var(--foreground);
    background: var(--background);
    font-family: Arial, Helvetica, sans-serif;
    contain: content;
    overflow-x: hidden; /* Prevent horizontal scrollbar during transitions */
  }

  /* Layout styles */
  .content-wrapper {
    width: 100%;
    min-height: 100vh;
    margin-left: var(--sidebar-width);
    transition: margin-left 150ms ease-out;
    contain: paint;
  }

  .content-container {
    margin: 0 auto;
    margin-left: 4rem;
    padding: 0 1.5rem;
    max-width: 1200px;
  }

  /* When sidebar is hidden */
  body[style*="--sidebar-visible:0"] .content-wrapper {
    margin-left: 0;
  }

  body[style*="--sidebar-visible:0"] .content-container {
    margin-left: auto;
  }

  /* Common elements */
  a {
    color: var(--link);
    text-decoration: underline;
  }

  a:hover {
    opacity: 0.9;
  }

  ::selection {
    background: var(--selection);
    color: var(--foreground);
  }

  .border {
    border-color: var(--border);
  }

  .text-muted {
    color: var(--comment);
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion) {
    :root {
      --theme-transition-duration: 0ms;
    }
    
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  @media (forced-colors: active) {
    * {
      border-color: currentColor;
    }
  }
}
`;
