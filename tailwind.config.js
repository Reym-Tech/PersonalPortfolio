/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Elegant design system (DESIGN.md): primary/display=Google Sans, mono=Anonymous Pro
        'display': ['"Google Sans"', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['"Anonymous Pro"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      colors: {
        // Elegant design system tokens (DESIGN.md). Light/dark values live as CSS
        // variables in index.css (:root / .dark). Channel-form vars + the
        // <alpha-value> shim keep Tailwind opacity modifiers (e.g. text-elegant-text/70)
        // working across both themes.
        elegant: {
          primary: 'rgb(var(--elegant-primary) / <alpha-value>)',
          secondary: '#8B5CF6',
          success: 'rgb(var(--elegant-success) / <alpha-value>)',
          warning: '#D97706',
          danger: '#DC2626',
          surface: 'rgb(var(--elegant-surface) / <alpha-value>)',
          text: 'rgb(var(--elegant-text) / <alpha-value>)',
          border: 'rgb(var(--elegant-border) / <alpha-value>)',
          muted: 'rgb(var(--elegant-muted) / <alpha-value>)',
          hover: 'rgb(var(--elegant-hover) / <alpha-value>)',
          active: 'rgb(var(--elegant-active) / <alpha-value>)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [],
}
