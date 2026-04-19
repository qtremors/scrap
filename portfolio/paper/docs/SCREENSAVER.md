# Screensaver Feature Documentation

This directory contains the extracted screensaver feature code from the main portfolio website.

## Files

### CSS Files (`temp/css/`)
- `screensaver.css` - Screensaver styles for `index.html` (DVD bouncing ASCII art)
- `tui-screensaver.css` - Pure CSS screensaver for `tui.html` (no JavaScript required)
- `transition-waterwash.css` - Water-wash page transition effect between index↔indexlite

### JavaScript Files (`temp/js/`)
- `screensaver.js` - JavaScript for `index.html` screensaver (activates after 1 minute idle)

---

# Water-Wash Transition Documentation

## Overview
Animated circular reveal/contract page transitions between `index.html` and `indexlite.html`.

## Removed From

### index.html
- CSS link (line 33): `<link rel="stylesheet" href="static/css/transition-waterwash.css">`
- Overlay HTML (lines 677-680): `<div class="waterwash-overlay expand">` with iframe
- Inline script (lines 682-728): transition handler for reading-mode-btn

### indexlite.html
- CSS link (line 13): `<link rel="stylesheet" href="static/css/transition-waterwash.css">`
- Overlay HTML (lines 324-330): `<div class="waterwash-overlay contract">` with 2 iframes

### static/js/indexlite.js
- `initPageTransitions()` function was simplified to direct navigation

## To Re-Enable Transitions

1. Move `temp/css/transition-waterwash.css` → `static/css/`
2. Re-add CSS links to `index.html` and `indexlite.html`
3. Re-add overlay HTML to both files
4. Restore the transition script in `index.html`
5. Restore `initPageTransitions()` in `indexlite.js`

---

# Screensaver HTML References (Now Removed)

### From index.html (line 32, 554)
```html
<link rel="stylesheet" href="static/css/screensaver.css">
<script src="static/js/screensaver.js" defer></script>
```

### From tui.html (line 16, 27-73, 159)
```html
<link rel="stylesheet" href="static/css/tui-screensaver.css">
<!-- Screensaver Toggle, Exit Label, Screen div, Menu trigger -->
```

### From project.html (line 36, 318)
```html
<link rel="stylesheet" href="static/css/screensaver.css">
<script src="static/js/screensaver.js" defer></script>
```

## To Re-Enable Screensaver

1. Move CSS files back: `temp/css/*.css` → `static/css/`
2. Move JS file back: `temp/js/*.js` → `static/js/`
3. Re-add the HTML references to `index.html`, `tui.html`, and `project.html`

