const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const projectsDir = path.join(rootDir, 'projects');
const templatePath = path.join(rootDir, '_template.html');
const outputPath = path.join(rootDir, 'index.html');

function getProjectItems() {
    return fs.readdirSync(projectsDir, { withFileTypes: true })
        .filter(dirent =>
            dirent.isDirectory() &&
            !dirent.name.startsWith('_') &&
            !dirent.name.startsWith('.')
        )
        .map(dirent => dirent.name)
        .sort();
}

function getCategory(folderName) {
    const prefix = folderName.split('-')[0];
    const categories = {
        'portfolio': { emoji: '🎨', name: 'portfolio' },
        'game': { emoji: '🎮', name: 'game' },
        'component': { emoji: '🧩', name: 'component' },
        'template': { emoji: '📄', name: 'template' },
        'gallery': { emoji: '🖼️', name: 'gallery' },
        'showcase': { emoji: '✨', name: 'showcase' },
        'archive': { emoji: '📦', name: 'archive' }
    };
    return categories[prefix] || { emoji: '📁', name: 'other' };
}

function generateCardHTML(folderName) {
    let title = folderName.replace(/[-_]/g, ' ');
    let note = '';
    let linkPath = `./projects/${folderName}/index.html`;
    const category = getCategory(folderName);


    const metaPath = path.join(projectsDir, folderName, 'meta.json');
    if (fs.existsSync(metaPath)) {
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            if (meta.title) title = meta.title;
            if (meta.note) note = meta.note;
            if (meta.mainFile) linkPath = `./projects/${folderName}/${meta.mainFile}`;
        } catch (e) {
            console.warn(`Could not parse meta.json for ${folderName}: ${e.message}`);
        }
    } else if (!fs.existsSync(path.join(projectsDir, folderName, 'index.html'))) {
        console.warn(`No index.html or meta.json found for ${folderName}. Skipping.`);
        return null;
    }

    const noteHTML = note ? `<p class="project-note">${note}</p>` : '';

    return `
    <a href="${linkPath}" class="project-card" data-category="${category.name}" aria-label="${title} - ${category.name} project" target="_blank" rel="noopener noreferrer">
        <h5><span class="category-icon">${category.emoji}</span> ${title}</h5>
        <pre class="link-path">${linkPath}</pre>
        ${noteHTML}
    </a>`;
}


try {
    console.log('Starting build...');

    const projectItems = getProjectItems();

    const projectLinks = projectItems
        .map(generateCardHTML)
        .filter(Boolean)
        .join('\n');

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const finalHtml = templateContent.replace('{{PROJECT_CARDS}}', projectLinks);

    fs.writeFileSync(outputPath, finalHtml);
    console.log(`Successfully built index.html with ${projectItems.length} projects.`);

} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}