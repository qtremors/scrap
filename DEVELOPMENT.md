# Scrapyard - Developer Documentation

> Comprehensive documentation for developers working on the Scrapyard Digital Graveyard.

**Version:** 2.5.1 | **Last Updated:** 2026-01-13

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Build System](#build-system)
- [Search Implementation](#search-implementation)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Architecture Overview

Scrapyard follows a **Static Site Generation (SSG)** pattern driven by a Node.js build script.

```
┌──────────────────────────────────────────────────────────────┐
│                      Project Folders                         │
│       (Raw project files + optional meta.json)               │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                        build.js                              │
│       (Filesystem scanning & Category Mapping)               │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                      index.html                              │
│       (Final static site with injected cards)                │
└──────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Vanilla JS** | Minimizes overhead and ensures long-term "archival" stability without framework rot. |
| **Meta.json** | Allows project-specific overrides (title, main file) without hardcoding in the build script. |
| **Canvas Throttling** | Limits background animation to 30fps to ensure the site remains lightweight even with many projects. |
| **Scattered vs Grid** | Uses a "messy" scattered layout by default to match the "scrapyard" theme, but switches to an organized grid during search for usability. |

---

## Project Structure

```
scrap/
├── public/               # Static assets
│   ├── index.css         # Main styles (Cyberpunk theme)
│   ├── index.js          # Layout logic & Canvas animation
│   └── favicon.svg       # Project logo
├── projects/             # Organized project storage
│   ├── [category]/       # archive, component, demo, game, models, portfolio, etc.
│   │   └── [project]/    # Individual project files (index.html, meta.json)
├── build.js              # SSG logic
├── _template.html        # Base HTML skeleton
├── README.md             # User-facing documentation
├── DEVELOPMENT.md        # This file
├── CHANGELOG.md          # Version history
└── LICENSE.md            # License terms
```

---

## Build System

The build script (`build.js`) performs the following steps:
1. **Scans**: Looks through the `projects/` directory for subfolders matching known categories.
2. **Metadata**: Parses `meta.json` if available; otherwise, infers metadata from filenames.
3. **Template**: Reads `_template.html` and replaces placeholders (`{{PROJECT_CARDS}}`, `{{VERSION}}`).
4. **Output**: Writes the final `index.html` and updates `metadata.json`.

```bash
# Run the build
node build.js
```

---

## Search Implementation

The search functionality is combined with the category filters:
- **Real-time Filtering**: Filters based on text content and selected category.
- **Layout Switch**: If a search query or filter is active, the layout switches from `scattered` to `grid` to make results easier to scan.
- **Debounced Previews**: Live previews are debounced by 1s to prevent overwhelming the browser with iframe loads during mouse movement.

---

## Deployment

### GitHub Pages Deployment

The project is automatically deployed via GitHub Actions when changes are pushed to `main`.

1. **Checkout**: Pulls the latest code.
2. **Build**: Runs `npm run build` to generate the latest `index.html`.
3. **Deploy**: Uploads the root directory to GitHub Pages.

---

## Contributing

### Folder Conventions
- All project folders must move to their respective category folder in `projects/`.
- Project folders should ideally follow the `category-name` naming convention for clarity.
- Always include an `index.html` or specify a `mainFile` in `meta.json`.

### Pull Request Process
1. Add your project to the correct `projects/` subfolder.
2. Run `node build.js` to verify it registers correctly.
3. Commit and push.

---

<p align="center">
  <a href="README.md">← Back to README</a>
</p>
