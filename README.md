# Scrapyard - Digital Graveyard of Projects

A high-tech, cyberpunk-themed digital archive for abandoned, scrapped, and forgotten web project ideas.

🗑️ **Website: [`https://qtremors.github.io/scrap`](https://qtremors.github.io/scrap)**

## The Concept

Every developer has a folder of unfinished projects and half-baked ideas. This "Digital Graveyard" gives them a final resting place in a premium, interactive archive.

## Features

-   **Cyberpunk Aesthetics**: Dark theme, neon accents, glitch effects, and digital noise texture.
-   **Category Visual Indicators**: Emoji icons and color-coded borders for each project type (🎨 Portfolio, 🎮 Game, 🧩 Component, 📄 Template, 🖼️ Gallery, ✨ Showcase, 📦 Archive, 🚀 Demo).
-   **Terminal Search**: Filter projects instantly using the command-line style input at the top.
-   **Live Previews**: Hover over any card for 1 second to see a live running preview of the project in the background.
-   **Interactive Background**: A dynamic HTML5 Canvas "Digital Matrix Rain" animation.
-   **Responsive Layout**: Scatters cards nicely on desktop but stacks them cleanly on mobile.
-   **Automated Indexing**: The `build.js` script automatically scans the `projects/` folder and regenerates the site.

## Repository Structure

The repository is organized to keep the root clean:

```
/
├── public/                      # Core site assets (css, js, favicon)
├── projects/                    # Folder containing all scrapped projects
│   ├── portfolio-*              # Portfolio website experiments
│   ├── game-*                   # Game projects
│   ├── component-*              # UI component demos
│   ├── template-*               # Reusable templates
│   ├── gallery-*                # Showcase galleries
│   ├── showcase-*               # Design showcases
│   ├── archive-*                # Archived old projects
│   └── demo-*                   # Live demos of projects
├── build.js                     # Node.js script to generate index.html
├── _template.html               # HTML template for the main page
└── index.html                   # Generated entry point (DO NOT EDIT DIRECTLY)
```

### Folder Naming Convention

All project folders follow the `category-name` format (e.g., `portfolio-terminal`, `game-stellar-flare`).

## How to Add a New Project

1.  Create a new folder inside `projects/` (e.g., `projects/my-new-idea`).
2.  Add your project files (`index.html`, etc.) inside that folder.
3.  **(Optional)** Add a `meta.json` file in your folder for custom details:
    ```json
    {
      "title": "My Cool Idea",
      "mainFile": "demo.html",
      "note": "A physics engine test that went wrong."
    }
    ```
4.  Run `node build.js` locally to test, or just push to `main` to let GitHub Actions handle it.

## Local Development

```bash
# Install dependencies (optional, for build script only)
npm install

# Build the site
npm run build

# Serve locally (using any static server)
npx serve
# or
python -m http.server 8000
```

## Technology Stack

-   **HTML5 & CSS3**: Custom properties, glassmorphism, animations.
-   **Vanilla JavaScript**: No frameworks. Handles logic, search, and canvas rendering.
-   **Node.js**: Used for the build script.