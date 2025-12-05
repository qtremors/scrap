import { CONFIG } from './config.js';
import { initPhysics, filterBubbles } from './physics.js';
import { initUI, closeModal } from './ui.js';

async function init() {
  try {
    const response = await fetch(CONFIG.DATA_PATH);
    const projects = await response.json();

    const container = document.getElementById('playground');
    const dock = document.getElementById('filter-dock');

    // Initialize Modules
    initPhysics(projects, container);
    initUI(dock);

    // Generate Filter Buttons
    generateFilters(projects, dock);

    // Close modal on close button click
    document.getElementById('close-modal-btn').onclick = closeModal;

  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

function generateFilters(projects, dock) {
  const categories = new Set(['All']);
  projects.forEach(p => { if (p.category) categories.add(p.category); });

  const sortedCats = Array.from(categories).sort();

  dock.innerHTML = '';
  sortedCats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat === 'All' ? 'active' : ''}`;
    btn.textContent = cat;
    btn.onclick = () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterBubbles(cat);
    };
    dock.appendChild(btn);
  });
}

init();
