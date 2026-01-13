# Scrapyard - Tasks

> **Project:** Scrapyard  
> **Version:** 2.5.1  
> **Last Updated:** 2026-01-13

---

## ✅ Completed (v2.5.1)

### Infrastructure
- [x] Implement nested category structure in `projects/`.
- [x] Support `models` category with 👾 icon.
- [x] Create automated `build.js` script with recursive scanning.
- [x] Implement real-time terminal search.
- [x] Add live iframe previews on hover.
- [x] Align project documentation with Tremors templates.

### UI/UX
- [x] Implement Cyberpunk theme (Neon accents, Digital Rain background).
- [x] Optimize background canvas for performance (30fps throttle).
- [x] Add category filter buttons.
- [x] Implement responsive "Scattered to Grid" layout transition.

---

## 🚧 In Progress

### Content
- [/] Archiving remaining legacy experiments.
- [/] Updating individual project `meta.json` files for better descriptions.

---

## 📋 To Do

### High Priority
- [ ] **Accessibility Audit**: Improve keyboard navigation for project cards.
- [ ] **Preview Optimization**: Implement a loading state/spinner for iframe previews.

### Medium Priority
- [ ] **Sort Options**: Add ability to sort by date or alphabetically.
- [ ] **Tagging System**: Support multiple tags per project in `meta.json`.

### Low Priority
- [ ] **Stats Dashboard**: A small panel showing project distributions by category.

---

## 🐛 Bug Fixes

- [ ] **PREVIEW-1:** Fix iframe scaling for projects with non-responsive designs.
- [ ] **TRANSITION-1:** Smooth out the "Scattered to Grid" layout jump on some resolutions.

---

## 💡 Ideas / Future

- **3D Gallery**: A WebGL-based room where project cards float as holograms.
- **Code Snippet Preview**: Ability to see a snippet of the code directly in the card.

---

## 🏗️ Architecture Notes

- **Static First**: Keep the core lightweight; no external JS dependencies (except for build-time).
- **Attribution**: Ensure every project card can link back to its original source or author if applicable.

---
