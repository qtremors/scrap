# Digital Graveyard of Scrapped Projects

A unique, scroll-based showcase for my abandoned, scrapped, and forgotten web project ideas. This project visualizes discarded concepts as a scattered pile of papers that you can scroll through in a 3D-like environment.

📄 **Website: [`https://qtremors.github.io/scrap`](https://qtremors.github.io/scrap)**

## The Concept

Every developer has a folder of unfinished projects, dead-ends, and half-baked ideas. Instead of letting them rot in a forgotten directory, this page gives them a final resting place. It serves as a visual, interactive archive of what could have been.

The layout is designed to feel like you're looking down a road littered with discarded notes, with each "note" being a link to a scrapped project.

## Features

  - **Dynamic 3D Layout:** On page load, project cards are scattered pseudo-randomly in a multi-column layout with slight rotations to give a natural, disordered look.
  - **Interactive Scrolling:** As you scroll down the page, you move "through" the cards, creating a simple but effective parallax effect.
  - **3D Hover Effect:** Hovering over a card lifts it towards the viewer (`translateZ`) and brings it into focus, removing its rotation and adding a highlight shadow.
  - **Responsive Design:** The layout automatically adjusts to a single column on smaller screens for a better mobile experience.
  - **Automatic Project Population:** Uses a Node.js build script and GitHub Actions to automatically find project folders and generate the links, keeping the main page in sync with the repo.
  - **Vanilla Stack:** Built with pure HTML, CSS, and JavaScript. No external libraries or frameworks are needed.

## How it Works (Automation)

This project uses a simple CI/CD pipeline to automatically generate the main `index.html` file.

1.  A **GitHub Action** (`.github/workflows/deploy.yml`) triggers on every push to the `main` branch.
2.  The action runs a **Node.js script** (`build.js`).
3.  This script scans the repository's root for project directories (ignoring any folder prefixed with `_` or `.`).
4.  For each project folder found, it generates an HTML "project card" to be injected into the main page.
5.  The script looks for a `meta.json` file inside each project folder to get a custom title, note, or a specific main file (if not `index.html`).
6.  It injects the list of generated cards into a template file (`_template.html`) and saves the final output as `index.html`.
7.  The GitHub Action then deploys the entire repository (including the newly built `index.html`) to GitHub Pages.

## How to Add a New Project

Adding a new scrapped project is simple:

1.  Create a new folder in the root of this repository (e.g., `my-new-scrapped-idea`).
2.  Add all your project files (`index.html`, `style.css`, etc.) inside this new folder.
3.  **(Optional)** For a custom title, note, or main file, create a `meta.json` in your project's folder:
    ```json
    {
      "title": "My Custom Title",
      "mainFile": "start.html",
      "note": "This was a test for CSS grid."
    }
    ```
4.  Commit and push your new folder to the `main` branch.

That's it\! The GitHub Action will automatically detect the new folder, rebuild the site, and add your project card to the page.

## Technology Stack

  - **HTML5:** For the core structure and content.
  - **CSS3:** For styling, animations, and the 3D perspective layout.
  - **Vanilla JavaScript:** For dynamically positioning the cards and handling scroll/resize events.
  - **Node.js:** Used in the `build.js` script to read the file system and generate the final `index.html`.
  - **GitHub Actions:** For the automated build-and-deploy CI/CD pipeline.