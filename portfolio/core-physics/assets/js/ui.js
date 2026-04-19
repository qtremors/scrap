import { togglePhysics } from './physics.js';

let dockElementRef = null;
let isDockVisible = true;
let settingsModal = null;
let modal = null;
let modalContent = null;

export function initUI(dockElement) {
  dockElementRef = dockElement;
  settingsModal = document.getElementById('settings-modal');
  modal = document.getElementById('modal');
  modalContent = document.getElementById('modal-content');

  // Global Click Handler
  document.addEventListener('click', handleGlobalClick);

  // Double Click Handlers
  document.addEventListener('dblclick', handleGlobalDoubleClick);

  // Mobile Double Tap
  let lastTap = 0;
  document.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      handleGlobalDoubleClick(e);
      e.preventDefault();
    }
    lastTap = currentTime;
  });

  // Settings Toggle
  const toggle = document.getElementById('toggle-physics');
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      togglePhysics(e.target.checked);
    });
  }

  // Close Buttons
  const closeSettings = document.getElementById('close-settings-btn');
  if (closeSettings) closeSettings.onclick = () => settingsModal.classList.remove('active');

  if (settingsModal) {
    settingsModal.onclick = (e) => {
      if (e.target === settingsModal) settingsModal.classList.remove('active');
    };
  }

  // Escape Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (settingsModal) settingsModal.classList.remove('active');
    }
  });
}

function isInteractive(e) {
  return e.target.closest('.bubble') ||
    e.target.closest('.filter-dock') ||
    e.target.closest('.modal-card') ||
    e.target.tagName === 'A' ||
    e.target.tagName === 'BUTTON' ||
    e.target.tagName === 'INPUT' ||
    e.target.tagName === 'LABEL';
}

function handleGlobalClick(e) {
  if (isInteractive(e)) return;

  isDockVisible = !isDockVisible;
  if (isDockVisible) {
    dockElementRef.classList.remove('dock-hidden');
  } else {
    dockElementRef.classList.add('dock-hidden');
  }
}

function handleGlobalDoubleClick(e) {
  if (isInteractive(e)) return;
  settingsModal.classList.add('active');
}

// --- MODAL LOGIC ---
export function openMiniModal(project) {
  const projectUrl = `project.html?id=${project.id}`;

  // Generate badges HTML
  const badgesHtml = project.badges.map(b =>
    `<span class="badge">${b.replace('tech-', '')}</span>`
  ).join('');

  // Logic for BG Color support in Modal
  // If bg_color exists -> Set bg color, remove glow filter, add box shadow
  // If no bg_color -> Default CSS handles transparency and glow filter
  const imgStyle = project.bg_color
    ? `background-color: ${project.bg_color}; filter: none; box-shadow: 0 5px 15px rgba(0,0,0,0.3);`
    : ``;

  modalContent.innerHTML = `
        <div class="modal-header">
            ${project.image ? `<img src="${project.image}" class="modal-img" style="${imgStyle}" alt="${project.title}">` : ''}
            <div>
                <div class="modal-title">${project.title}</div>
                <div class="modal-badges">${badgesHtml}</div>
            </div>
        </div>
        <p class="modal-desc">${project.description}</p>
        <div class="modal-actions">
            <a href="${projectUrl}" class="btn-primary">View Project Page</a>
        </div>
    `;
  modal.classList.add('active');
}

export function closeModal() {
  if (modal) modal.classList.remove('active');
}
