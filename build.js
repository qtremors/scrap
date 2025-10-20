const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const templatePath = path.join(rootDir, '_template.html');
const outputPath = path.join(rootDir, 'index.html'); // This is the file GitHub Pages will serve

function getProjectItems() {
    return fs.readdirSync(rootDir, { withFileTypes: true })
        .filter(dirent => 
            dirent.isDirectory() &&                  // Must be a directory
            !dirent.name.startsWith('_') &&          // Ignore _scrapped
            !dirent.name.startsWith('.')             // Ignore .git, .github
        )
        .map(dirent => dirent.name)
        .sort(); // Sort alphabetically
}

function generateCardHTML(folderName) {
    let title = folderName.replace(/[-_]/g, ' ');
    let note = ''; // Default to empty string
    let linkPath = `./${folderName}/index.html`;

    // Handle directory case
    const metaPath = path.join(rootDir, folderName, 'meta.json');
    if (fs.existsSync(metaPath)) {
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            if (meta.title) title = meta.title;
            if (meta.note) note = meta.note; // Get the note text
            if (meta.mainFile) linkPath = `./${folderName}/${meta.mainFile}`;
        } catch (e) {
            console.warn(`Could not parse meta.json for ${folderName}: ${e.message}`);
        }
    } else if (folderName === 'index4') { 
        // Fallback for your specific case
        note = 'This requires a running server for the json data';
    } else if (!fs.existsSync(path.join(rootDir, folderName, 'index.html'))) {
        console.warn(`No index.html or meta.json found for ${folderName}. Skipping.`);
        return null; // Skip this folder
    }

    // Create the note HTML only if a note exists
    const noteHTML = note ? `<p class="project-note">${note}</p>` : '';

    return `
    <a href="${linkPath}" class="project-card">
        <h5>${title}</h5>
        <pre class="link-path">${linkPath}</pre>
        ${noteHTML}
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