# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite (http://localhost:5173)
- `npm run build` - Type-check then build for production (outputs to /dist)
- `npm run lint` - Run ESLint on all .ts and .tsx files
- `npm run preview` - Preview production build locally

## Project Architecture

### Tech Stack
- Vite 7 as build tool with React plugin
- React 19 with TypeScript
- Tailwind CSS 4 for styling (configured via @import in global.css)
- Framer Motion for animations
- Lucide React for icons

### File Organization
- `src/components/` - All React components:
  - UI primitives (button.tsx, card.tsx, badge.tsx, input.tsx, textarea.tsx) in `src/components/ui/`
  - Feature sections: Hero.tsx, About.tsx, Projects.tsx, Contacts.tsx, Footer.tsx
  - Layout: Navigation.tsx, MobileNavLinks.tsx, ThemeToggle.tsx
  - Shared: ImageWithFallback.tsx (handles image loading errors), BackgroundAnimation.tsx
- `src/hooks/` - Custom React hooks:
  - useTheme.ts - Manages light/dark theme via localStorage and html class
  - useScroll.ts - Tracks scroll position for navbar styling
- `src/utils/` - Utility functions:
  - scrollToSection.ts - Smooth scrolling to section IDs
  - pageNames.ts - Constants for section IDs
- `src/assets/` - Static assets (avatar.png, react.svg, favicon.svg)
- `public/` - Public assets served at root:
  - vite.svg
  - favicon.svg
  - avatar.png
  - projects/ - Project showcase images (lendami.png, volendaystaffing.png, asiaceo.png, map.png, speedtest.png)
- `src/styles/global.css` - Tailwind base + custom CSS variables for light/dark themes

### Styling Approach
- Tailwind CSS with custom CSS properties defined in :root and .dark
- Dark mode toggled by adding/removing "dark" class on document.documentElement
- Custom animations: gradient-shift, float-orbs
- Glass morphism via .glass class (backdrop-filter + border)
- Theme-aware colors using CSS variables (--background, --foreground, etc.)

### State & Interactions
- Theme state: useTheme hook persists preference to localStorage
- Scroll state: useScroll hook triggers navbar background on scroll
- Navigation: Client-side scrolling to sections via scrollToSection utility
- Image loading: ImageWithFallback component provides error fallback

### Key Patterns
- Motion variants: Components use framer-motion for entrance animations (initial, whileInView, viewport)
- Component composition: UI primitives compose into feature sections (e.g., Projects uses Card, Badge, Button, ImageWithFallback)
- TypeScript: Strict mode enabled via tsconfig.json references