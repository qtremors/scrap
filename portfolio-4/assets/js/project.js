import { CONFIG } from './config.js';

async function loadProjectPage() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(CONFIG.DATA_PATH);
    const projects = await response.json();
    const project = projects.find(p => p.id === projectId);

    if (!project) throw new Error("Project not found");

    renderProject(project);

  } catch (error) {
    document.body.innerHTML = `
            <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;">
                <h1>Project Not Found</h1>
                <a href="index.html" style="color:#3b82f6;margin-top:20px;">Return Home</a>
            </div>
        `;
  }
}

function renderProject(project) {
  document.title = `${project.title} // Tremors`;

  // Header
  document.getElementById('p-title').textContent = project.title;
  document.getElementById('p-category').textContent = project.category;

  // Banner Image
  const banner = document.getElementById('p-banner');
  if (project.image) {
    banner.src = project.image;
  } else {
    // Fallback or hide if no image
    document.querySelector('.project-banner-wrapper').style.display = 'none';
  }

  // Main Content
  // Check for full_details, fallback to description
  document.getElementById('p-description').textContent = project.full_details || project.description;

  // Installation
  const installBlock = document.getElementById('p-installation');
  const installSection = document.getElementById('section-installation');

  if (project.installation) {
    installBlock.textContent = project.installation;
  } else {
    installSection.style.display = 'none';
  }

  // Sidebar - Links
  const linksContainer = document.getElementById('p-links');
  project.links.forEach(link => {
    // Determine icon based on link text/type (simple check)
    let arrow = "↗";
    if (link.text.toLowerCase().includes('github')) arrow = "code";

    linksContainer.innerHTML += `
            <a href="${link.url}" target="_blank" class="link-btn">
                ${link.text} <span>${arrow === 'code' ? '{}' : '↗'}</span>
            </a>
        `;
  });

  // Sidebar - Tech Stack
  const tagsContainer = document.getElementById('p-tags');
  project.badges.forEach(badge => {
    const name = badge.replace('tech-', '');
    tagsContainer.innerHTML += `<span class="tech-tag">${name}</span>`;
  });
}

loadProjectPage();
