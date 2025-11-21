# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Viola Cai's personal portfolio website, built as a single-page application for a Financial Advisor. The site features animated hero sections, smooth scrolling, scroll-triggered animations, and a particle background effect.

## Tech Stack

- **Build Tool**: Vite 7.x
- **Styling**: TailwindCSS 4.x, Bootstrap 4.6.2, custom CSS
- **JavaScript**: ES6+ modules, jQuery 3.7.1
- **Animations**: GSAP 3.x (with ScrollTrigger and SplitText plugins)
- **Particles**: particles.js
- **Icons**: IonIcons
- **Package Manager**: Yarn (v1.22.22)

## Development Commands

```bash
# Start development server (runs on port 3000, opens automatically)
yarn start
# or
npm start

# Build for production (outputs to build/ directory with hashed assets)
yarn build
# or
npm run build

# Preview production build locally
yarn preview
# or
npm run preview
```

## File Structure

```
/
├── index.html              # Main HTML file (single-page app)
├── build/                  # Production build output
│   ├── index.html         # Built HTML
│   └── assets/            # Hashed, optimized assets (CSS, JS, images)
├── css/                   # Stylesheets
│   ├── tailwind.css       # Tailwind imports (@tailwind directives)
│   ├── bootstrap-custom.css
│   ├── main.css           # Custom styles
│   ├── ionicons.min.css
│   ├── custom.css
│   └── colors/            # Color scheme variants (e.g., main-red.css)
├── js/
│   └── main.js            # Main JavaScript (GSAP animations, jQuery logic)
├── img/                   # Image assets (portraits, backgrounds, icons)
├── fonts/                 # Font files (IonIcons)
├── crm.appscript.js       # Google Apps Script for CRM functionality
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration (Tailwind + Autoprefixer)
└── vite.config.js         # Vite configuration
```

## Architecture & Key Components

### Styling Architecture

The project uses a multi-layer styling approach:
1. **TailwindCSS** - Utility-first CSS framework via `@tailwind base/components/utilities` in css/tailwind.css
2. **Bootstrap** - Pre-built components and grid system in css/bootstrap-custom.css
3. **Custom CSS** - Project-specific styles in css/main.css and css/custom.css
4. **Color Schemes** - Switchable color themes in css/colors/ (currently main-red.css)
5. **Icons** - IonIcons font library in css/ionicons.min.css

Color scheme switching is done by changing the `href` attribute of the link with `id="color-scheme"` in index.html:36.

### JavaScript Architecture

The main JavaScript logic resides in js/main.js and includes:

1. **Smooth Scrolling** - Click handlers for anchor links with `data-scroll` attribute (lines 9-22)
2. **Animated Headlines** - Rotating text animation for the hero section using jQuery (lines 24-100)
3. **Particle Background** - particles.js configuration for the hero section (lines 102-211)
4. **Page Load Animations** - Preloader fade-out and body opacity animation (lines 213-217)
5. **Scroll-Triggered Animations** - GSAP ScrollTrigger for:
   - Active navigation state tracking (lines 219-235)
   - Title split animations with elastic easing (lines 237-250)

**GSAP Plugins Used**: ScrollTrigger, SplitText (loaded via CDN, registered in js/main.js:4)

### Build System (Vite)

Configuration in vite.config.js:
- **Development**: Port 3000, auto-opens browser
- **Production**: Outputs to `build/` directory with asset hashing
- **CSS**: Configured to use './postcss.config.js'

The build process:
- Processes TailwindCSS via PostCSS
- Bundles and optimizes all assets
- Generates hashed filenames for cache-busting
- Outputs to build/assets/ with referenced in build/index.html

## Key Sections of index.html

- **Preloader** (lines 40-48): Loading animation on page load
- **Sidebar Navigation** (lines 50-82): Fixed sidebar with profile info and menu
- **Home/Hero Section** (lines 85-130): Animated headline with particle background
- Additional sections (About, Services, etc.) continue below...

## No Test Suite

This project does not include any test files (no .test.js or .spec.js files found). Testing would need to be set up separately if required.

## Google Apps Script (CRM)

The crm.appscript.js file contains Google Apps Script functions for managing customer relationships. This file is not part of the website build but serves as a separate CRM tool that can be used alongside the portfolio site.

## Development Notes

- The site is a single-page application with all content in index.html
- Animations are handled by GSAP with ScrollTrigger for scroll-based effects
- The site uses both ES6 modules (imports) and jQuery for different parts
- Assets in build/ are hashed and should not be manually edited
- No source maps or TypeScript - plain JavaScript
- No testing framework configured
- Caching is disabled in production via .htaccess for all static assets
