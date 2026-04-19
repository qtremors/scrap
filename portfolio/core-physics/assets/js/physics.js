import { CONFIG } from './config.js';
import { openMiniModal } from './ui.js';

let bubbles = [];
let draggedBubble = null;
let currentRadius = 70;
let dragOffset = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };
let smoothedVelocity = { x: 0, y: 0 };
let totalDragDist = 0;
let container = null;
let isPhysicsEnabled = true;

export function togglePhysics(enabled) {
  isPhysicsEnabled = enabled;
}

export function initPhysics(projects, containerEl) {
  container = containerEl;
  calculateOptimalRadius(projects.length);

  projects.forEach(project => spawnBubble(project));

  requestAnimationFrame(update);
  addDragListeners();
}

function calculateOptimalRadius(count) {
  const screenArea = window.innerWidth * window.innerHeight;
  const targetArea = screenArea * CONFIG.COVERAGE_RATIO;
  let r = Math.sqrt(targetArea / count / Math.PI);
  r = Math.max(CONFIG.MIN_RADIUS, Math.min(CONFIG.MAX_RADIUS, r));
  currentRadius = Math.floor(r);
}

function spawnBubble(project) {
  const el = document.createElement('div');
  el.className = 'bubble';
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', project.title);
  el.style.width = `${currentRadius * 2}px`;
  el.style.height = `${currentRadius * 2}px`;

  if (project.image) el.style.backgroundImage = `url('${project.image}')`;

  // Check for BG Color override
  if (project.bg_color) {
    el.style.backgroundColor = project.bg_color;
    el.classList.add('bubble-solid');
  } else {
    el.classList.add('bubble-transparent');
  }

  el.innerHTML = ``; // Empty content (image only)

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openMiniModal(project);
  });

  // --- Calculate position BEFORE appending to DOM ---
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Calculate start position (Center + tiny random offset)
  const startX = centerX + (Math.random() - 0.5) * 5;
  const startY = centerY + (Math.random() - 0.5) * 5;

  // Apply the position IMMEDIATELY so it never renders at 0,0
  el.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;

  container.appendChild(el);

  const startSpeed = CONFIG.IDLE_SPEED * 4;
  const angle = Math.random() * Math.PI * 2;

  const bubbleObj = {
    el: el,
    x: startX, // Use the calculated startX
    y: startY, // Use the calculated startY
    vx: Math.cos(angle) * startSpeed,
    vy: Math.sin(angle) * startSpeed,
    savedVx: 0, savedVy: 0,
    category: project.category || 'Other',
    projectData: project,
    isHidden: false,
    isHovered: false
  };

  el.addEventListener('mouseenter', () => handleHover(bubbleObj, true));
  el.addEventListener('mouseleave', () => handleHover(bubbleObj, false));

  bubbles.push(bubbleObj);
}

function handleHover(b, entering) {
  if (draggedBubble === b || b.isHidden) return;
  if (entering) {
    b.savedVx = b.vx; b.savedVy = b.vy;
    b.vx = 0; b.vy = 0;
    b.isHovered = true;
  } else {
    if (isPhysicsEnabled) {
      b.vx = b.savedVx; b.vy = b.savedVy;
    }
    b.isHovered = false;
  }
}

function addDragListeners() {
  window.addEventListener('mousedown', dragStart);
  window.addEventListener('touchstart', dragStart, { passive: false });
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('touchmove', dragMove, { passive: false });
  window.addEventListener('mouseup', dragEnd);
  window.addEventListener('touchend', dragEnd);
}

function dragStart(e) {
  const target = e.target.closest('.bubble');
  if (!target) return;
  e.preventDefault();

  const b = bubbles.find(obj => obj.el === target);
  if (b && !b.isHidden) {
    draggedBubble = b;
    draggedBubble.el.classList.add('is-dragging');
    draggedBubble.isHovered = false;

    draggedBubble.vx = 0; draggedBubble.vy = 0;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragOffset.x = clientX - draggedBubble.x;
    dragOffset.y = clientY - draggedBubble.y;
    lastMousePos = { x: clientX, y: clientY };
    smoothedVelocity = { x: 0, y: 0 };
    totalDragDist = 0;
  }
}

function dragMove(e) {
  if (!draggedBubble) return;
  e.preventDefault();

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const rawVx = clientX - lastMousePos.x;
  const rawVy = clientY - lastMousePos.y;
  lastMousePos = { x: clientX, y: clientY };

  totalDragDist += Math.sqrt(rawVx ** 2 + rawVy ** 2);

  smoothedVelocity.x = (smoothedVelocity.x * (1 - CONFIG.SMOOTHING_FACTOR)) + (rawVx * CONFIG.SMOOTHING_FACTOR);
  smoothedVelocity.y = (smoothedVelocity.y * (1 - CONFIG.SMOOTHING_FACTOR)) + (rawVy * CONFIG.SMOOTHING_FACTOR);

  draggedBubble.x = clientX - dragOffset.x;
  draggedBubble.y = clientY - dragOffset.y;

  bubbles.forEach(other => {
    if (other === draggedBubble || other.isHidden) return;
    const dx = other.x - draggedBubble.x;
    const dy = other.y - draggedBubble.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = currentRadius * 2;

    if (dist < minDist) {
      const angle = Math.atan2(dy, dx);
      const overlap = minDist - dist;
      other.x += Math.cos(angle) * overlap;
      other.y += Math.sin(angle) * overlap;

      if (!other.isHovered && isPhysicsEnabled) {
        other.vx += Math.cos(angle) * 1.5 + (smoothedVelocity.x * 0.2);
        other.vy += Math.sin(angle) * 1.5 + (smoothedVelocity.y * 0.2);
      }
    }
  });
}

function dragEnd() {
  if (draggedBubble) {
    if (totalDragDist < CONFIG.CLICK_THRESHOLD) {
      openMiniModal(draggedBubble.projectData);
    } else {
      const speed = Math.sqrt(smoothedVelocity.x ** 2 + smoothedVelocity.y ** 2);
      if (speed > CONFIG.MIN_THROW_SPEED && isPhysicsEnabled) {
        draggedBubble.vx = smoothedVelocity.x * CONFIG.THROW_FORCE;
        draggedBubble.vy = smoothedVelocity.y * CONFIG.THROW_FORCE;
      } else if (isPhysicsEnabled) {
        const angle = Math.random() * Math.PI * 2;
        draggedBubble.vx = Math.cos(angle) * CONFIG.IDLE_SPEED;
        draggedBubble.vy = Math.sin(angle) * CONFIG.IDLE_SPEED;
      }
    }
    draggedBubble.el.classList.remove('is-dragging');
    draggedBubble = null;
    smoothedVelocity = { x: 0, y: 0 };
  }
}

export function filterBubbles(category) {
  bubbles.forEach(b => {
    const match = category === 'All' || b.category === category;
    b.isHidden = !match;
    if (match) b.el.classList.remove('hidden');
    else b.el.classList.add('hidden');
  });
}

function update() {
  if (!isPhysicsEnabled && !draggedBubble) {
    requestAnimationFrame(update);
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const diameter = currentRadius * 2;

  for (let i = 0; i < bubbles.length; i++) {
    const b1 = bubbles[i];
    if (b1.isHidden || b1 === draggedBubble || b1.isHovered) continue;

    for (let j = i + 1; j < bubbles.length; j++) {
      const b2 = bubbles[j];
      if (b2.isHidden || b2 === draggedBubble || b2.isHovered) continue;

      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = diameter + 10;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const force = CONFIG.REPULSION_FORCE;
        b1.vx -= Math.cos(angle) * force;
        b1.vy -= Math.sin(angle) * force;
        b2.vx += Math.cos(angle) * force;
        b2.vy += Math.sin(angle) * force;
      }
    }
  }

  bubbles.forEach(b => {
    let scale = b.isHidden ? 0 : 1;
    if (b.el.classList.contains('is-dragging')) scale = 1.1;

    b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) scale(${scale})`;

    if (b.isHidden || b === draggedBubble || b.isHovered) return;

    b.x += b.vx;
    b.y += b.vy;

    if (b.x + diameter > width) { b.x = width - diameter; b.vx *= -1 * CONFIG.BOUNCE_DAMPING; }
    if (b.x < 0) { b.x = 0; b.vx *= -1 * CONFIG.BOUNCE_DAMPING; }
    if (b.y + diameter > height) { b.y = height - diameter; b.vy *= -1 * CONFIG.BOUNCE_DAMPING; }
    if (b.y < 0) { b.y = 0; b.vy *= -1 * CONFIG.BOUNCE_DAMPING; }

    const currentSpeed = Math.sqrt(b.vx ** 2 + b.vy ** 2);
    if (Math.abs(currentSpeed - CONFIG.IDLE_SPEED) > 0.1) {
      if (currentSpeed > CONFIG.IDLE_SPEED) {
        b.vx *= (1 - CONFIG.SPEED_RECOVERY);
        b.vy *= (1 - CONFIG.SPEED_RECOVERY);
      } else if (currentSpeed < CONFIG.IDLE_SPEED && currentSpeed > 0.1) {
        b.vx *= (1 + CONFIG.SPEED_RECOVERY);
        b.vy *= (1 + CONFIG.SPEED_RECOVERY);
      } else if (currentSpeed <= 0.1) {
        b.vx += (Math.random() - 0.5);
        b.vy += (Math.random() - 0.5);
      }
    }
  });

  requestAnimationFrame(update);
}
