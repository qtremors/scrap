<p align="center">
  <img src="public/favicon.svg" alt="Scrapyard Logo" width="120"/>
</p>

<h1 align="center"><a href="https://qtremors.github.io/scrap">Scrapyard</a></h1>

<p align="center">
  A high-tech, cyberpunk-themed digital archive for abandoned, scrapped, and forgotten web project ideas.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.6.0-00f0ff?logo=node.js" alt="Version">
  <img src="https://img.shields.io/badge/Build-SSG-ebdbb2?logo=javascript" alt="Build">
  <img src="https://img.shields.io/badge/License-TSL-red" alt="License">
</p>

> [!NOTE]
> **Personal Project** 🎯 I built this to give my folder of unfinished projects and half-baked ideas a final resting place in a premium, interactive archive.

## Live Website 

**➡️ [https://qtremors.github.io/scrap](https://qtremors.github.io/scrap)**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Cyberpunk Aesthetics** | Dark theme, neon accents, glitch effects, and digital noise texture. |
| 👾 **Category Visual Indicators** | Emoji icons and color-coded borders for each project type (🎨 Portfolio, 🎮 Game, 👾 Models, etc.). |
| 🔍 **Terminal Search** | Filter projects instantly using the command-line style input at the top. |
| 👁️ **Live Previews** | Hover over any card for 1 second to see a live running preview in the background. |
| ⛈️ **Digital Rain** | A dynamic HTML5 Canvas "Digital Matrix Rain" background animation. |
| 📱 **Responsive Layout** | Intelligent scattered layout for desktop and clean stacks for mobile. |
| 🏗️ **Automated Indexing** | Node.js build script scans category folders and regenerates the site. |

---

## 🚀 Quick Start

```bash
# Clone and navigate
git clone https://github.com/qtremors/scrap.git
cd scrap

# Install dependencies (only for the build script)
npm install

# Build the site
npm run build

# Serve locally
npx serve
# or
python -m http.server 8000
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3 (Custom Properties) |
| **Logic** | Vanilla JavaScript (No frameworks) |
| **Build System** | Node.js (File system scanning, template injection) |
| **Deployment** | GitHub Actions & GitHub Pages |

---

## 📁 Project Structure

```
scrap/
├── public/                      # Core site assets (css, js, favicon)
├── archive/                     # Old/Archived projects
├── component/                   # UI component demos
├── demo/                        # Live demos
├── gallery/                     # Gallery showcases
├── game/                        # Game projects
├── models/                      # 3D model showcases
├── portfolio/                   # Portfolio experiments
├── showcase/                    # Design showcases
├── template/                    # Template experiments
├── utilities/                   # Utility tools (Clock, etc.)
├── metadata.json                # Auto-generated catalog of all projects
├── build.js                     # Node.js script to generate index.html
├── _template.html               # HTML template for the main page
├── README.md                    # You are here
└── index.html                   # Generated entry point (DO NOT EDIT)
```

---

## 📊 System Resources

| Metric | Value |
|--------|-------|
| **CPU** | < 5% (Throttled to 30fps) |
| **RAM** | Low (Static HTML/JS) |
| **Disk** | ~20MB (including project assets) |

---

## 🧪 Testing

The build script validates metadata and file existence during generation.

```bash
npm run build
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Architecture, build system, and folder conventions. |
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes. |
| [TASKS.md](TASKS.md) | Planned features and known issues. |
| [LICENSE.md](LICENSE.md) | License terms and attribution. |

---

## 📄 License

**Tremors Source License (TSL)** - Source-available license allowing viewing, forking, and derivative works with **mandatory attribution**. Commercial use requires written permission.

Web Version: [github.com/qtremors/license](https://github.com/qtremors/license)

See [LICENSE.md](LICENSE.md) for full terms.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/qtremors">Tremors</a>
</p>