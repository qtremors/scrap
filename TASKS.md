# Scrapyard - Tasks

> **Project:** Scrapyard  
> **Version:** 2.5.3  
> **Last Updated:** 2026-03-03

---

## A. Correctness & Reliability

- [ ] **[BUG] Deprecated CSS `clip` property in glitch animation**: `index.css` lines 130/137 use `clip: rect(...)` which is deprecated. Replace with `clip-path: inset(...)` for future-proofing and cross-browser consistency.
- [ ] **[BUG] Container height miscalculated when filtering on mobile**: `applyFilters()` in `index.js` recalculates container height using desktop grid logic (`gridCols = 4`) even on mobile where CSS overrides `#card-container` to `height: auto`. The JS-set height gets applied but is invisible due to CSS `!important`, creating a confusing code path that could break if CSS specificity changes.
- [ ] **[BUG] `setupLayout()` called redundantly during filter reset**: When clearing a search/filter (line 211), `applyFilters()` calls `setupLayout()`, which resets `paperObjects` and repositions all cards — but `applyFilters()` already repositioned visible cards in its own loop, causing double-work and a potential visual flicker.
- [ ] **[BUG] Mobile card styles not properly restored after resize**: `setupLayout()` sets `paper.style = ''` on mobile (line 34) to clear inline styles, but if `applyFilters()` was previously active, the `opacity` and `pointerEvents` inline styles are not guaranteed to reset since `applyFilters()` sets them directly.
- [ ] **[BUG] Particle positions use stale `width`/`height` after rapid resizes**: `resizeCanvas()` reinitializes all particles, but existing animation frames in-flight still reference the old `width`/`height` closures. A rapid resize could cause a single frame to draw particles at stale coordinates.
- [ ] **[BUG] `animationId` not cancelled before `resizeCanvas()` reinitializes particles**: When `resizeCanvas` is called on window resize, `initParticles()` replaces the particle array, but the old `animationId` frame loop is still running and will iterate over the new (shorter or different) array without issues, but the timing mismatch could cause a single blank frame.
- [ ] **[EDGE CASE] Search matches against `innerText` which includes the emoji icons**: Searching for "📦" or other emoji characters will match cards unexpectedly. The search should ideally match against the project title and note only, not the category icon.
- [ ] **[EDGE CASE] `getProjectMetadata` returns `null` for projects without `index.html` or `meta.json`, but loose root projects are also scanned**: If a non-project directory exists directly under `projects/` and doesn't match a category name, it will be scanned and potentially included or produce a warning.

---

## B. Security

- [ ] **[SEC] `project.note` in `build.js` is injected as raw HTML without escaping**: `generateCardHTML()` (line 135) injects `project.note` directly into an HTML string. If a `meta.json` contains `"note": "<img src=x onerror=alert(1)>"`, it will execute as XSS in the generated page. Escape HTML entities before injection.
- [ ] **[SEC] `project.title` is also injected without HTML escaping**: Same XSS vector as above — `build.js` line 138 injects `project.title` raw into the `<h5>` and `aria-label` attributes.
- [ ] **[SEC] Deploy workflow uploads entire repository to GitHub Pages**: `deploy.yml` line 35 uses `path: .` which deploys everything including `.git/`, `build.js`, `_template.html`, `package.json`, and `node_modules/` (if present). This exposes internal tooling and metadata. Should deploy only the necessary files or use an explicit list.

---

## C. Performance & Resource Efficiency

- [ ] **[PERF] `mousemove` handler triggers `requestAnimationFrame` on every mouse event**: The parallax handler (line 96–114 of `index.js`) calls `requestAnimationFrame` for every mousemove event without cancelling the previous frame, potentially queueing many redundant rAF callbacks. Should use a single rAF loop or debounce.
- [ ] **[PERF] Resize handler for canvas is not debounced**: `window.addEventListener('resize', resizeCanvas)` (line 311) fires on every pixel change during a resize, causing repeated full canvas reinitialization — `initParticles()` recreates the entire particle array each time.
- [ ] **[PERF] `applyFilters()` repositions ALL cards on every keystroke**: Each input event calls `applyFilters()`, which iterates all cards and modifies every card's inline `style` properties (`top`, `left`, `transform`, `opacity`, `pointerEvents`). For 30+ cards this is fine, but the pattern doesn't scale, and the DOM reads/writes are interleaved (thrashing).
- [ ] **[PERF] Favicon uses inline SVG emoji rendering which is inconsistent per-browser**: The favicon (both inline data URI and `favicon.svg`) relies on browser emoji rendering of 🗑️. Consider using a proper SVG icon for consistent appearance.

---

## D. Architecture & Design Quality

- [ ] **[ARCH] Generated `index.html` and `metadata.json` are committed to version control**: Both `index.html` and `metadata.json` are build artifacts that should ideally be in `.gitignore` and regenerated by CI. Committing them leads to merge conflicts and stale data when projects are added without running `build.js`.
- [ ] **[ARCH] Category filter buttons are hardcoded in `_template.html`**: If a new category is added to `build.js` (e.g., "tool"), the filter button must be manually added to `_template.html`. The build script should generate the filter buttons dynamically from the discovered categories.
- [ ] **[ARCH] `models` category prefix is inconsistent**: All other categories use singular folder names matching their prefix (e.g., `portfolio/portfolio-*`), but the `models` category contains projects with `model-` prefix (singular), not `models-`. This inconsistency means the `getCategory` fallback logic (line 51) would categorize a loose `model-alien-x` folder as "other" instead of "models".
- [ ] **[ARCH] `prefixMap` in `getCategory()` is missing `models`**: The fallback prefix map (line 52–61) does not include `'model': 'models'`, so any loose project starting with `model-` would be classified as `other` instead of `models`.
- [ ] **[ARCH] Tight coupling between CSS layout and JS positioning**: Desktop card layout is entirely managed via JS absolute positioning, while mobile reverts to CSS flex. This creates two independent layout systems that must stay in sync, making changes risky.

---

## E. Maintainability & Code Quality

- [ ] **[MAINT] Unused `mouseX`/`mouseY` variables persist across handler invocations**: `mouseX` and `mouseY` (line 93–94 of `index.js`) are set but never read outside the mousemove handler's rAF callback. They serve no purpose as module-scoped variables; they could be local to the handler.
- [ ] **[MAINT] Comment typo "scapyard" on line 232 of `index.js`**: Should be "scrapyard".
- [ ] **[MAINT] `CONFIG.DESKTOP.ROAD_WIDTH` naming is misleading**: "ROAD_WIDTH" doesn't clearly describe what it controls (the percentage of viewport width used for card placement). A name like `CONTENT_WIDTH_RATIO` would be clearer.
- [ ] **[MAINT] Dead `fsPath` variable computed but only used once**: In `getProjectMetadata()`, `fsPath` is computed (line 90) and `webPath` is an alias for `projectPath` (line 91). The dual-variable pattern is slightly confusing when one could be inlined.
- [ ] **[MAINT] Magic numbers scattered throughout `index.js`**: Values like `40` (noise range), `6` (rotation range), `20` (parallax range) are inline constants with no named references, making tuning difficult.
- [ ] **[MAINT] `_template.html` and `index.html` share identical static markup**: Any change to the header/footer in `_template.html` requires a rebuild to propagate. The template approach is correct, but the committed `index.html` creates a risk of manual edits that get overwritten.

---

## F. Documentation Quality

- [x] **[DOC] README badge shows version 2.5.1 but actual version is 2.5.2**: The `img.shields.io` badge in `README.md` line 12 hardcodes `2.5.1`. It should be updated to `2.5.2` or generated dynamically.
- [x] **[DOC] README project structure is incomplete**: The structure diagram (line 74–89) omits `showcase/`, `gallery/`, and `template/` category folders which exist in the project, and still doesn't list `TASKS.md`.
- [ ] **[DOC] README claims "Glassmorphism" in tech stack but it was removed**: CSS line 288 and 295 have comments noting `backdrop-filter` was removed for GPU performance. The README (line 65) still lists "Glassmorphism" as a technology. The CHANGELOG v2.2.0 confirms removal.
- [ ] **[DOC] DEVELOPMENT.md "Intended Changes" section has a typo**: Line 134 says "archivel" instead of "archival".
- [ ] **[DOC] DEVELOPMENT.md "Naming Conventions" section is sparse**: Only covers folder naming, but doesn't document CSS class naming, JS variable naming, or `meta.json` field conventions despite these being important for contributors.
- [ ] **[DOC] CHANGELOG doesn't document the `other` category**: `build.js` supports an `other` category (line 12, 62, 75) but it is never mentioned in any documentation or changelog entry.
- [ ] **[DOC] Footer copyright says "© 2025" but current year is 2026**: `_template.html` line 62 hardcodes `© 2025`. Should be `© 2025-2026` or dynamically generated.

---

## G. Configuration & Infrastructure

- [ ] **[INFRA] No `.gitignore` file present**: The project has no `.gitignore`, which means `node_modules/` (if installed), OS-specific files (`.DS_Store`, `Thumbs.db`), and editor configs could be committed.
- [ ] **[INFRA] GitHub Actions deploys the entire repo including source files**: `deploy.yml` uploads `path: .` to Pages, exposing `build.js`, `_template.html`, `package.json`, `.github/`, and all Node.js tooling to the public web. Should deploy only the subset needed for the website.
- [ ] **[INFRA] No Node.js version pinning via `.nvmrc` or `engines` field**: `package.json` has no `engines` field; `deploy.yml` pins Node 20, but local development could use any version, risking subtle incompatibilities.
- [ ] **[INFRA] `npm install` in CI with no `package-lock.json`**: The project has no lockfile, making CI builds non-deterministic. However, since there are zero production dependencies, this is low-risk but still a best-practice gap.
- [ ] **[INFRA] No build validation step in CI**: The deploy pipeline runs `npm run build` but doesn't validate the output (e.g., checking that `index.html` was generated, that project links resolve). A simple smoke test would catch broken builds before deployment.

---

## H. General Anomalies

- [ ] **[ANOMALY] `index.html` uses `<pre>` for the link path display**: Using `<pre>` (lines 60, 66, etc.) for a single-line path is semantically incorrect. A `<span>` or `<code>` with `white-space: pre` would be more appropriate.
- [ ] **[ANOMALY] Card hover `translateZ(20px)` has no parent `perspective`**: The 3D transform `scale(1.05) translateZ(20px)` on `.project-card:hover` (line 311 of CSS) requires a `perspective` property on an ancestor to have any visible 3D effect. Without it, the `translateZ` does nothing.
- [ ] **[ANOMALY] `noise-overlay` has `z-index: 1000` which sits above all interactive content**: The noise texture overlay has an extremely high z-index but `pointer-events: none`. While clicks pass through, screen readers or touch interactions on some browsers may not properly ignore it.
- [ ] **[ANOMALY] `favicon.svg` exists in `public/` but the HTML uses an inline data URI favicon**: `_template.html` line 21–22 uses a data URI favicon (`data:image/svg+xml,...`), making the separate `public/favicon.svg` file unused by the website. The README references it for the logo, but the favicon is duplicated.
