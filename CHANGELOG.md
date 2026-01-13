# Scrapyard Changelog

> **Project:** Scrapyard  
> **Version:** 2.5.1  
> **Last Updated:** 2026-01-13

---

## [2.5.1] - 2026-01-13

### Added
- **Models Category**: Added support for 3D model showcases with a new 👾 filter.
- **New Project: Alien X Model**: A high-fidelity 3D model showcase.
- **New Project: Universal Error Page**: A playful, multi-state error page collection.

### Fixed
- **Build Script**: Fixed `build.js` to properly inject the version number into the footer.
- **Cross-Platform Paths**: Ensured web links in `metadata.json` always use forward slashes regardless of the OS.
- **Metadata Validation**: Added checks to ensure project `mainFile` exists before linking to it.

---

## [2.5.0] - 2025-12-29

### Added
- **Universal Metadata**: `metadata.json` is now generated in the root, cataloging all projects with title, category, and paths.
- **Nested Category Structure**: Projects are now organized into subdirectories (e.g., `projects/game/stellar-flare`).
- **Stellar Flare Redux**: Merged legacy and modular versions of Stellar Flare into a single collection with a new launcher.

### Changed
- **Project Reorganization**: Moved all 29 projects into category-specific subfolders (`projects/portfolio/`, `projects/game/`, etc.) to declutter the workspace.
- **Build System**: Updated `build.js` to support recursive project scanning and metadata generation.

---

## [2.4.0] - 2025-12-25

### Added
- **New Component: Newspaper Archive**: Five scalable archive designs including calendar grid and timeline.
- **New Component: Hero Concepts**: 7 unique hero section concepts (3D Cube, Hologram, etc.).
- **New Component: Footer Collection**: 7 responsive footer layouts collection.
- **New Component: Newspaper Skills**: Skills section layouts inspired by newspaper classifieds.

---

## [2.3.0] - 2025-12-22

### Added
- **New Category: Demo** 🚀: Added "demo" category for live demo projects with blue (#3b82f6) color accent.
- **New Project: Git Nexus Demo**: GitHub repository navigator with profile viewing, README previews, and theme switching.
- **New Project: Paper Portfolio (Lite)**: Minimal reading-mode portfolio with TOC sidebar and clean typography.

### Changed
- Updated category filter buttons to include 🚀 Demo filter.
- Updated documentation (README) with demo category in features and folder structure.

---

## [2.2.0] - 2025-12-19

### Added
- **Category Visual Indicators**: Emoji icons and color-coded borders for each category.
- **Category Filter Buttons**: Quick filter by category with 8 clickable buttons.
- **Clear Search Button**: X button to quickly clear the search input.
- **Project Count Indicator**: Shows "SHOWING X OF Y PROJECTS" during search/filter.
- **Footer**: Added footer with version info, GitHub link, and copyright.
- **Skip-to-Content Link**: Accessibility improvement for keyboard users.
- **ARIA Labels**: All project cards now have proper aria-label attributes.
- **Reduced Motion Support**: Added `prefers-reduced-motion` media query.
- **Local Development Section**: Added to README with serve commands.

### Changed
- **Folder Naming Convention**: Reorganized all 24 project folders to follow `category-name` format.
- **Demos Reorganization**: Split `demos/` folder into 12 individual portfolio project folders.
- **Templates Rename**: `templates/` → `template-material-ecommerce`
- **Contrast Fix**: Improved text contrast for WCAG AA compliance (`#a0a0a0`).

### Performance
- **Canvas Throttled to 30fps**: Reduced from 60fps to save GPU.
- **Particle Count Reduced**: From 150 to 80 particles.
- **Removed `backdrop-filter: blur()`**: Major GPU savings.
- **Removed `will-change`**: Eliminated unnecessary GPU layers.
- **Tab Visibility API**: Canvas pauses when tab is hidden.

### Fixed
- **Typo**: Fixed `aestroid-runner` → `game-asteroid-runner`.
- **iframe Race Condition**: Fixed preview flickering with `isPreviewActive` flag.
- **Dead Code**: Removed legacy `index4` check from build.js.
- **Browser Compatibility**: Added `@supports` fallback for `color-mix()`.

### Removed
- **Duplicate Projects**: Removed `solar-runner_1` and `stellar-flare` (kept better versions).

---

## [2.0.0] - 2025-12-09

### Added
- **Terminal Search**: A real-time command-line style search bar to filter projects.
- **Live Previews**: Hovering over a project card shows a live iframe preview of the site in the background (debounced by 1s).
- **Interactive Background**: A "Digital Rain" HTML5 Canvas animation.
- **Templates Project**: Added a dedicated `templates` folder with metadata.
- **Public Directory**: Created `public/` folder to organized core assets (`index.js`, `index.css`, `favicon.svg`).

### Changed
- **Visual Redesign**: Complete overhaul from "Scattered Papers" to "Cyberpunk Digital Archive".
- **Repository Structure**: Moved all project folders into a `projects/` subdirectory to clean up the root.
- **Typography**: Switched to `Space Mono` (headers) and `Inter` (body) via Google Fonts.
- **Build System**: Updated `build.js` to scan the new `projects/` directory and link to assets in `public/`.

### Fixed
- **Mobile Layout**: Optimized the scatter effect to disable on mobile for better usability.
- **Live Preview Scope**: Fixed an issue where `isMobile` was undefined in the preview logic.
- **Search Visibility**: Implemented a dynamic grid layout for search results to ensure matched items are always visible and not off-screen.
- **Search Performance**: Optimized search filtering with `requestAnimationFrame` and CSS `will-change` properties to prevent FPS drops during typing.
