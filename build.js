const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const templatePath = path.join(rootDir, '_template.html');
const outputPath = path.join(rootDir, 'index.html');

function getProjectItems() {
    return fs.readdirSync(rootDir, { withFileTypes: true })
        .filter(dirent => 
            dirent.isDirectory() &&
            !dirent.name.startsWith('_') &&
            !dirent.name.startsWith('.')
        )
        .map(dirent => dirent.name)
        .sort();
}

function generateCardHTML(folderName) {
    let title = folderName.replace(/[-_]/g, ' ');
    let note = '';
    let linkPath = `./${folderName}/index.html`;


    const metaPath = path.join(rootDir, folderName, 'meta.json');
    if (fs.existsSync(metaPath)) {
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            if (meta.title) title = meta.title;
            if (meta.note) note = meta.note;
            if (meta.mainFile) linkPath = `./${folderName}/${meta.mainFile}`;
        } catch (e) {
            console.warn(`Could not parse meta.json for ${folderName}: ${e.message}`);
        }
    } else if (folderName === 'index4') {
        note = 'This requires a running server for the json data';
    } else if (!fs.existsSync(path.join(rootDir, folderName, 'index.html'))) {
        console.warn(`No index.html or meta.json found for ${folderName}. Skipping.`);
        return null;
    }

    const noteHTML = note ? `<p class="project-note">${note}</p>` : '';

    return `
    <a href="${linkPath}" class="project-card" target="_blank" rel="noopener noreferrer">
        <h5>${title}</h5>
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