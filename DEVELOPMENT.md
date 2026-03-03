# Scrapyard - Developer Documentation

> Comprehensive documentation for developers working on the Scrapyard Digital Graveyard.

**Version:** 2.5.3 | **Last Updated:** 2026-03-03

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Naming Conventions](#naming-conventions)
- [Build System](#build-system)
- [Search Implementation](#search-implementation)
- [Deployment](#deployment)
- [Intended Changes](#intended-changes)
- [Project Auditing](#project-auditing--quality-standards)
- [Troubleshooting](#troubleshooting)
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
│   ├── [category]/       # archive, component, demo, gallery, game, models, portfolio, showcase, template
│   │   └── [project]/    # Individual project files (index.html, meta.json)
├── build.js              # SSG logic
├── _template.html        # Base HTML skeleton
├── README.md             # User-facing documentation
├── DEVELOPMENT.md        # This file
├── CHANGELOG.md          # Version history
├── TASKS.md              # Planned features and known issues
└── LICENSE.md            # License terms
```

---

## Naming Conventions

> Names should be self-documenting. A reader should understand what a file, function, or component does without opening it.

### Files & Directories

| Type | Convention | Good Example |
|------|-----------|--------------|
| **Project Folders** | `category-project-name` | `portfolio-terminal` |

---

## Build System

The build script (`build.js`) performs the following steps:
1. **Scans**: Looks through the `projects/` directory for subfolders matching known categories.
2. **Metadata**: Parses `meta.json` if available; otherwise, infers metadata from filenames.
3. **Template**: Reads `_template.html` and replaces placeholders (`{{PROJECT_CARDS}}`, `{{VERSION}}`).
4. **Output**: Writes the final `index.html` and updates `metadata.json`.

> [!CAUTION]
> **`index.html` is a generated build artifact.** Never edit it directly — your changes will be overwritten on the next build. All markup changes should be made in `_template.html`, then regenerated with `npm run build`.

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

## Intended Changes

> A log of deliberate but unconventional code, design decisions, or structure choices that might look like bugs or bad practices to an outside observer. If a change is weird, it's documented here so it isn't accidentally "fixed".

| Component / Feature | Deliberate Weirdness | Rationalization |
|---------------------|-----------------------|-----------------|
| **Canvas Loop**     | Throttling `requestAnimationFrame` to 30 FPS instead of the monitor's natural refresh rate. | Prevents high GPU loads and laptop battery drain for an aesthetic background where 60+ FPS isn't strictly necessary. |
| **Vanilla JS**      | Avoiding modern bundlers and frontend frameworks (React/Vue/Svelte). | Prioritizing decades-long archivel stability without framework rot or dependency deprecation. |

### Technical Debt

- [ ] Accessibility: Improve keyboard navigation for project cards.

---

## Project Auditing & Quality Standards

> A structured approach to ensuring the project is correct, secure, and maintainable.

### System Understanding

Before making significant changes, ensure a deep understanding of:
- **Core Architecture**: Workflows, data flow, and overall purpose.
- **Implicit Design**: Assumptions and hidden coupling between components.
- **Edge Cases**: UNintended behaviors and alternative use cases.

### Audit Categories

Evaluate changes and existing code against these dimensions:

| Category | Focus Areas |
|----------|-------------|
| **Correctness** | Logical errors, edge-case failures, silent failures, data integrity |
| **Security** | Vulnerabilities, auth flaws, input weaknesses, sensitive data exposure |
| **Performance** | Algorithm efficiency, query optimization, resource overuse (CPU/RAM) |
| **Architecture** | Bottlenecks, tight coupling, structural mismatches, scalability |
| **Maintainability** | Readability, naming consistency, technical debt, dead code |
| **Documentation** | Accuracy, completeness, implementation-spec matching |
| **Infrastructure** | Environment config, deployment risks, secret management |

### General Anomalies

Identify and resolve anything that is:
- **Confusing**: Inconsistent or unjustified logic.
- **Out of place**: Contextually surprising behavior.
- **Undocumented**: Implicit assumptions that aren't spelled out.

### Reporting Process

- All audit findings must be added to [TASKS.md](TASKS.md).
- Ensure entries are **Clear**, **Actionable**, and **Concisely described**.
- Avoid vague statements; provide concrete context and impact.

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Projects not showing** | Verify that `npm run build` completed without errors and the project folder starts with an approved category prefix. |

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
