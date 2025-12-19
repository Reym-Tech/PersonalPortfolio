# AI Coding Instructions for Gonzales Portfolio

## Project Overview
This is a **React portfolio web application** for John Remy Gonzales (BSIT student). It's a single-page application showcasing projects, skills, and contact information with modern glassmorphism UI and smooth animations.

**Tech Stack:**
- React 19.2.3 (bootstrapped with Create React App 5.0.1)
- Tailwind CSS 3.4.19 for styling
- Framer Motion 12.23.26 for animations
- React Testing Library for tests

## Architecture & Patterns

### Component Structure
- **Single Root Component**: [App.js](src/App.js) exports a default `Portfolio` component containing all sections
- **Section-based Layout**: Home, About, Skills, Projects, and Contact sections defined with semantic `<section>` HTML elements
- **Navigation**: Fixed navbar with smooth scroll links (`#home`, `#about`, etc.)

### Styling Approach
- **Tailwind CSS only** - all styling via utility classes in [index.css](src/index.css) (imports Tailwind directives)
- **No CSS-in-JS** - keep styling in markup
- **Color scheme**: Dark theme with gradients (`from-[#0f172a]` to `black`), cyan/purple accents
- **Responsive**: Use `md:` breakpoint for tablet+; design is mobile-first
- **Glassmorphism**: Heavy use of `backdrop-blur-xl`, `bg-white/10` for frosted glass effect

### Animation Patterns
- **Framer Motion**: Used via `<motion.div>` for all animations
- Common patterns (from [App.js](src/App.js)):
  - `initial={{ y: -80, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}` for entrance
  - `whileInView={{ opacity: 1 }}` for scroll-triggered animations
  - `whileHover={{ scale: 1.1 }}` for interactive elements
  - `animate={{ y: [0, -20, 0] }}` with `transition={{ repeat: Infinity, duration: 6 }}` for floating effect

## Development Workflow

### Local Development
```bash
npm start          # Runs dev server on http://localhost:3000 (watch mode)
npm run build      # Production build to /build folder (minified with hashes)
npm test           # Jest test runner in interactive watch mode
npm run eject      # ⚠️ One-way operation - manual webpack control
```

### Key Files
- [src/index.js](src/index.js) - React entry point
- [src/index.css](src/index.css) - Tailwind imports
- [tailwind.config.js](tailwind.config.js) - Tailwind configuration (minimal - no custom theme)
- [package.json](package.json) - Dependencies and scripts

### Testing Setup
- Testing Library configuration in [setupTests.js](src/setupTests.js)
- Example test exists: [App.test.js](src/App.test.js)

## Important Conventions

### Naming & Organization
- Component names use PascalCase (e.g., `Portfolio`)
- Default exports for main components
- All styles via Tailwind - avoid [App.css](src/App.css) for new components

### Responsive Design
- Mobile-first: design without `md:` breakpoint first, then add tablet/desktop variants
- Use `max-w-6xl` for content containers, `px-10` for padding
- Stack vertically on mobile (`grid md:grid-cols-3` defaults to single column)

### Image Handling
- Images stored in [public/images/](public/images/) directory
- Reference with `/images/filename` (absolute path from public)
- Example: `/images/profile1.jpg`

## Critical Developer Notes

1. **No component splitting yet** - Everything is in App.js. If adding components, create them in `src/components/` and import them.

2. **Tailwind scope** - All CSS must use Tailwind utilities. Custom CSS should go in separate `.module.css` files if needed (but prefer Tailwind).

3. **Framer Motion patterns** - Always destructure motion from framer-motion and wrap DOM elements, not React components.

4. **Window resizing** - Portfolio uses `h-screen` and `flex` for hero section - ensure animations work on all viewport sizes.

5. **Asset paths** - Images use public directory routing (`/images/` not `./public/images/`).

## Testing & Debugging
- Run `npm test` to launch Jest in watch mode
- Check browser console for React warnings
- Use React DevTools browser extension for component inspection
- CSS issues? Verify Tailwind classes are spelled correctly and `index.css` imports are present

## Production Considerations
- `npm run build` outputs to `build/` (commit to gitignore)
- Source maps included in dev, stripped in prod
- Consider adding `.env` files for future API endpoints
