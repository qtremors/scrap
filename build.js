const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

const rootDir = __dirname;
const projectsDir = path.join(rootDir, 'projects');
const templatePath = path.join(rootDir, '_template.html');
const outputPath = path.join(rootDir, 'index.html');


// Categories to look for
const categories = ['archive', 'component', 'demo', 'gallery', 'game', 'models', 'portfolio', 'showcase', 'template', 'other'];

function getProjectItems() {
    const items = [];

    // Check for category folders
    categories.forEach(category => {
        const categoryPath = path.join(projectsDir, category);
        if (fs.existsSync(categoryPath) && fs.statSync(categoryPath).isDirectory()) {
            const projects = fs.readdirSync(categoryPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.'))
                .map(dirent => `${category}/${dirent.name}`); // Store with forward slashes
            items.push(...projects);
        }
    });

    // Also check root projects dir for any loose projects (backwards compatibility/misc)
    const rootProjects = fs.readdirSync(projectsDir, { withFileTypes: true })
        .filter(dirent =>
            dirent.isDirectory() &&
            !categories.includes(dirent.name) && // Don't re-scan category folders as projects
            !dirent.name.startsWith('_') &&
            !dirent.name.startsWith('.')
        )
        .map(dirent => dirent.name);
    items.push(...rootProjects);

    return items.sort();
}

function getCategory(projectPath) {
    // projectPath is likely 'category/project-name' (forward slashes)
    const parts = projectPath.split('/');
    let categoryName = 'other';

    if (parts.length > 1 && categories.includes(parts[0])) {
        categoryName = parts[0];
    } else {
        // Fallback
        const prefix = parts[parts.length - 1].split('-')[0];
        const prefixMap = {
            'portfolio': 'portfolio',
            'game': 'game',
            'component': 'component',
            'template': 'template',
            'gallery': 'gallery',
            'showcase': 'showcase',
            'archive': 'archive',
            'demo': 'demo'
        };
        categoryName = prefixMap[prefix] || 'other';
    }

    const emojiMap = {
        'portfolio': '🎨',
        'game': '🎮',
        'models': '👾',
        'component': '🧩',
        'template': '📄',
        'gallery': '🖼️',
        'showcase': '✨',
        'archive': '📦',
        'demo': '🚀',
        'other': '📁'
    };

    return { name: categoryName, emoji: emojiMap[categoryName] || '📁' };
}

function getProjectMetadata(projectPath) {
    // projectPath is 'category/project' or 'project' (with forward slashes)
    // Extract actual folder name for title generation
    const folderName = path.basename(projectPath);

    let title = folderName.replace(/[-_]/g, ' ');
    let note = '';

    // Normalize path separators for OS compatibility when checking filesystem
    const fsPath = projectPath.split('/').join(path.sep);
    const webPath = projectPath; // Already forward slashes

    let linkPath = `./projects/${webPath}/index.html`;

    const category = getCategory(projectPath);

    const metadata = {
        id: folderName,
        title: title,
        note: note,
        category: category.name,
        categoryEmoji: category.emoji,
        linkPath: linkPath,
        relativePath: `projects/${webPath}`
    };

    const metaPath = path.join(projectsDir, fsPath, 'meta.json');
    if (fs.existsSync(metaPath)) {
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            if (meta.title) metadata.title = meta.title;
            if (meta.note) metadata.note = meta.note;

            if (meta.mainFile) {
                // Validate if mainFile exists
                const mainFilePath = path.join(projectsDir, fsPath, meta.mainFile);
                if (fs.existsSync(mainFilePath)) {
                    metadata.linkPath = `./projects/${webPath}/${meta.mainFile}`;
                } else {
                    console.warn(`[WARN] Main file '${meta.mainFile}' specified in meta.json for '${folderName}' does not exist. Using default index.html.`);
                }
            }
        } catch (e) {
            console.warn(`Could not parse meta.json for ${folderName}: ${e.message}`);
        }
    } else if (!fs.existsSync(path.join(projectsDir, fsPath, 'index.html'))) {
        console.warn(`No index.html or meta.json found for ${folderName} at ${projectPath}. Skipping.`);
        return null;
    }

    return metadata;
}

function generateCardHTML(project) {
    const noteHTML = project.note ? `<p class="project-note">${project.note}</p>` : '';
    return `
    <a href="${project.linkPath}" class="project-card" data-category="${project.category}" aria-label="${project.title} - ${project.category} project" target="_blank" rel="noopener noreferrer">
        <h5><span class="category-icon">${project.categoryEmoji}</span> ${project.title}</h5>
        <pre class="link-path">${project.linkPath}</pre>
        ${noteHTML}
    </a>`;
}

try {
    console.log(`Starting build v${packageJson.version}...`);

    const projectItems = getProjectItems();

    const allMetadata = projectItems.map(getProjectMetadata).filter(Boolean);

    // Write metadata.json
    fs.writeFileSync(path.join(rootDir, 'metadata.json'), JSON.stringify(allMetadata, null, 2));
    console.log(`Generated metadata.json with ${allMetadata.length} items.`);

    const projectLinks = allMetadata
        .map(generateCardHTML)
        .join('\n');

    let templateContent = fs.readFileSync(templatePath, 'utf-8');

    // Inject version
    templateContent = templateContent.replace('{{VERSION}}', packageJson.version);

    const finalHtml = templateContent.replace('{{PROJECT_CARDS}}', projectLinks);

    fs.writeFileSync(outputPath, finalHtml);
    console.log(`Successfully built index.html with ${allMetadata.length} projects.`);

} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}