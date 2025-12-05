# Changelog

All notable changes to the **CORE** project will be documented in this file.

## [1.0.0] - 2023-10-27

### 🚀 Initial Release

This release marks the transition from a monolithic prototype to a modular, production-ready architecture.

### Added

- **Architecture:**
    
    - Split codebase into ES6 Modules (`physics.js`, `ui.js`, `main.js`, `config.js`) for better separation of concerns.
        
    - Implemented a separated CSS strategy (`core`, `physics`, `ui`, `project`).
        
- **Physics Engine:**
    
    - Added `drag-and-throw` mechanics with momentum smoothing.
        
    - Implemented "Speed Recovery" (breathing effect) where bubbles gently return to idle speed.
        
    - Added synchronous positioning fix to prevent bubbles spawning from (0,0) (FOUC fix).
        
- **UI & Design:**
    
    - **Bubble Style:** Bubbles are now transparent by default with a `drop-shadow` contour glow to hide image artifacts.
        
    - **Solid Bubbles:** Added support for `bg_color` in JSON to override transparency for specific logos.
        
    - **Hero Animation:** Added "Tremor" hover effect (shake + expansion) to the main title.
        
    - **Grid Overlay:** Added a subtle background grid texture for depth.
        
- **Project Page:**
    
    - Created `project.html` template.
        
    - Added dynamic data fetching based on URL query parameters (`?id=xyz`).
        
    - Designed a cinematic "Glassmorphic" layout with a banner image, tech stack tags, and deep links.
        
    - Added sidebar navigation and mobile responsive grid.
        
- **Interaction:**
    
    - Single click on empty space toggles the Filter Dock visibility.
        
    - Double click triggers the Settings Modal.
        
    - Added a toggle switch to pause/resume physics simulation.
        
    - Added keyboard support (`Enter` to open bubbles, `Esc` to close modals).
        

### Fixed

- Resolved z-index layering issue where the hero text was unclickable due to the physics container overlay.
    
- Fixed image scaling issues in bubbles (optimized to 150% zoom).
    
- Fixed banner image sizing on the project page to prevent it from occupying too much vertical space.
    

### Changed

- **Data Source:** Migrated hardcoded JS data to an external `data/projects.json` file.
    
- **Navigation:** Changed modal behavior to act as a gateway; clicking "View Project" now redirects to a dedicated full page instead of expanding in-place.