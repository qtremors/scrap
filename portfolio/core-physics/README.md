# CORE

A highly interactive, physics-based portfolio website designed to showcase projects in a "living universe." Projects float as bubbles in a zero-gravity environment, reacting to mouse interactions, dragging, and collisions.

## 🌟 Key Features

- **Physics Engine:** Custom 2D physics simulation with collision detection, momentum, and damping.
    
- **Bubble Navigation:** Projects are represented as floating bubbles that can be thrown, dragged, or clicked.
    
- **Dynamic Filtering:** Filter dock to sort bubbles by category (Website, Desktop, CLI, etc.).
    
- **Kinetic Typography:** "Breathing" and "Tremor" animations on the main title.
    
- **Detailed Project Pages:** A dedicated, dynamically generated details page for every project with deep linking support.
    
- **Settings System:** Toggle physics on/off directly from the UI.
    
- **Responsive Design:** Fully adaptive layouts for mobile and desktop, including touch events.
    
- **Modular Architecture:** Codebase split into ES6 modules (Physics, UI, Config) for maintainability.
    

## 📂 Project Structure

```
/
├── index.html          # Main Entry (The Physics Universe)
├── project.html        # Dynamic Project Details Page
├── data/
│   └── projects.json   # All project data source
└── assets/
    ├── css/
    │   ├── core.css    # Variables & Base styles
    │   ├── physics.css # Bubble & Animation styles
    │   ├── ui.css      # Shared UI (Dock, Modals, Hero)
    │   └── project.css # Specific styles for project.html
    └── js/
        ├── config.js   # Global constants (Physics tuning)
        ├── main.js     # Entry point for index.html
        ├── physics.js  # Collision & Movement logic
        ├── ui.js       # Modal & Interaction logic
        └── project.js  # Entry point for project.html
```

## 🎨 Customization

- **Add Projects:** Edit `data/projects.json`.
    
- **Tune Physics:** Edit `assets/js/config.js` (Gravity, bounce, friction).
    
- **Bubble Style:** Edit `assets/css/physics.css` (Radius, glow, transparency).