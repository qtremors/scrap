# Changelog

All notable changes to the "Scrapyard" project will be documented in this file.

## [2.1.0] - 2025-12-19

### Added
-   **Category Visual Indicators**: Emoji icons and color-coded borders for each category.
    -   🎨 Portfolio (cyan), 🎮 Game (red), 🧩 Component (purple), 📄 Template (green), 🖼️ Gallery (amber), ✨ Showcase (pink), 📦 Archive (gray)

### Changed
-   **Folder Naming Convention**: Reorganized all 24 project folders to follow `category-name` format.
    -   Categories: `portfolio-`, `game-`, `component-`, `template-`, `gallery-`, `showcase-`, `archive-`
    -   Example: `portfolio-1` → `portfolio-terminal`, `aestroid-runner` → `game-asteroid-runner`
-   **Demos Reorganization**: Split `demos/` folder into 12 individual portfolio project folders.
-   **Templates Rename**: `templates/` → `template-material-ecommerce`
-   **README Update**: Updated repository structure section to reflect new naming convention.

### Removed
-   **Duplicate Projects**: Removed `solar-runner_1` and `stellar-flare` (kept better versions).

### Fixed
-   **Typo**: Fixed `aestroid-runner` → `game-asteroid-runner`.
-   **Meta.json**: Updated all 24 `meta.json` files with accurate titles and descriptions.

## [2.0.0] - 2025-12-09

### Added
-   **Terminal Search**: A real-time command-line style search bar to filter projects.
-   **Live Previews**: Hovering over a project card shows a live iframe preview of the site in the background (debounced by 1s).
-   **Interactive Background**: A "Digital Rain" HTML5 Canvas animation.
-   **Templates Project**: Added a dedicated `templates` folder with metadata.
-   **Public Directory**: Created `public/` folder to organized core assets (`index.js`, `index.css`, `favicon.svg`).

### Changed
-   **Visual Redesign**: Complete overhaul from "Scattered Papers" to "Cyberpunk Digital Archive".
    -   Dark theme with charcoal/black background and cyan accents.
    -   Glassmorphism effects on cards.
    -   Glitched text effects on headers.
    -   Noise overlay for texture.
-   **Repository Structure**: Moved all project folders into a `projects/` subdirectory to clean up the root.
-   **Typography**: Switched to `Space Mono` (headers) and `Inter` (body) via Google Fonts.
-   **Build System**: Updated `build.js` to scan the new `projects/` directory and link to assets in `public/`.

### Fixed
-   **Mobile Layout**: Optimized the scatter effect to disable on mobile for better usability.
-   **Live Preview Scope**: Fixed an issue where `isMobile` was undefined in the preview logic.
-   **Search Visibility**: Implemented a dynamic grid layout for search results to ensure matched items are always visible and not off-screen.
-   **Search Performance**: Optimized search filtering with `requestAnimationFrame` and CSS `will-change` properties to prevent FPS drops during typing.
