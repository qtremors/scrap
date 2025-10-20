const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const templatePath = path.join(rootDir, '_template.html');
const outputPath = path.join(rootDir, 'index.html'); // This is the file GitHub Pages will serve

function getProjectItems() {
    return fs.readdirSync(rootDir, { withFileTypes: true })
        .filter(dirent => {
            // Must be a directory OR the specific 'ascii.html' file
            const isProjectDir = dirent.isDirectory() && 
                                 !dirent.name.startsWith('_') && 
                                 !dirent.name.startsWith('.');
            
            const isAsciiFile = dirent.isFile() && dirent.name === 'ascii.html';
            
            return isProjectDir || isAsciiFile;
        })
        .map(dirent => dirent.name)
        .sort(); // Sort alphabetically
}

function generateCardHTML(itemName) {
    let title = itemName.replace(/[-_]/g, ' ');
    let note = '';
    let linkPath = '';

    // Handle single file case
    if (itemName === 'ascii.html') {
        title = "Ascii Art Collection";
        linkPath = "./ascii.html";
        note = '';
        return `
    <a href="${linkPath}" class="project-card">
        <h5>${title}</h5>
        <pre class="link-path">${linkPath}${note}</pre>
    </a>`;
    }

    // Handle directory case
    linkPath = `./${itemName}/index.html`;

    // Extensibility: Look for a meta.json file in the directory
    const metaPath = path.join(rootDir, itemName, 'meta.json');
    if (fs.existsSync(metaPath)) {
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            if (meta.title) title = meta.title;
            if (meta.note) note = `<br>${meta.note}`;
            if (meta.mainFile) linkPath = `./${itemName}/${meta.mainFile}`;
        } catch (e) {
            console.warn(`Could not parse meta.json for ${itemName}: ${e.message}`);
        }
    } else if (itemName === 'index4') { 
        // Fallback for your specific case
        note = 'This requires a running server for the json data';
        linkPath = './index4/index.html';
    } else if (!fs.existsSync(path.join(rootDir, itemName, 'index.html'))) {
        console.warn(`No index.html or meta.json found for ${itemName}. Skipping.`);
        return null; // Skip this folder
    }

    return `
    <a href="${linkPath}" class="project-card">
        <h5>${title}</h5>
        <pre class="link-path">${linkPath.replace('<br>', '\n        ')}${note}</pre>
    </a>`;
}

// --- Main Build Process ---
try {
    console.log('Starting build...');
    
    const projectItems = getProjectItems();

    const projectLinks = projectItems
        .map(generateCardHTML)
        .filter(Boolean) // Remove any nulls
        .join('\n');

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const finalHtml = templateContent.replace('', projectLinks);

    fs.writeFileSync(outputPath, finalHtml);
    console.log(`Successfully built index.html with ${projectItems.length} projects.`);

} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}