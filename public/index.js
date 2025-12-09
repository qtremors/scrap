// Layout configuration
const CONFIG = {
    ROW_HEIGHT: 250, // Increased for better spacing
    TOP_MARGIN: 100, // Reduced as header takes space
    MOBILE_BREAKPOINT: 768,
    DESKTOP: { COLUMNS: 4, ROAD_WIDTH: 0.9 }, // 4 columns for better readability
};

document.addEventListener('DOMContentLoaded', () => {
    const papers = document.querySelectorAll('.project-card');
    const container = document.getElementById('card-container');
    let paperObjects = [];

    function setupLayout() {
        paperObjects = [];
        const isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;

        // Reset display for all papers first
        papers.forEach(p => {
            // If searching, we might hide some. For now, show all.
            p.style.display = 'flex';
        });

        if (isMobile) {
            // Reset styles for mobile (let CSS handle it)
            container.style.height = 'auto';
            papers.forEach(paper => {
                paper.style = '';
            });
            return;
        }

        const numCols = CONFIG.DESKTOP.COLUMNS;
        const roadWidthPercent = CONFIG.DESKTOP.ROAD_WIDTH;
        const rowHeight = CONFIG.ROW_HEIGHT;
        const topMargin = CONFIG.TOP_MARGIN;

        const scrollHeight = topMargin + (Math.ceil(papers.length / numCols) * rowHeight) + topMargin;
        container.style.height = `${scrollHeight}px`;

        const viewportWidth = window.innerWidth; // Use full width of container generally
        const roadWidthPx = viewportWidth * roadWidthPercent;
        const horizontalMarginPx = (viewportWidth - roadWidthPx) / 2;

        const pseudoRandom = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        papers.forEach((paper, index) => {
            // Deterministic "random" column to keep it stable but scattered
            // We want to fill roughly sequentially but with some noise
            const col = index % numCols;
            const row = Math.floor(index / numCols);

            // Add some noise to position
            const xNoise = (pseudoRandom(index + 100) - 0.5) * 40; // +/- 20px
            const yNoise = (pseudoRandom(index + 200) - 0.5) * 40; // +/- 20px

            const xOffset = (roadWidthPx / numCols) * col;

            const initialY = topMargin + (row * rowHeight) + yNoise;
            const initialX = horizontalMarginPx + xOffset + xNoise;

            const rotationZ = (pseudoRandom(index + 300) - 0.5) * 6; // +/- 3deg (subtle)

            paperObjects.push({
                element: paper, initialX, initialY, rotationZ
            });
        });
        updatePositions();
    }

    function updatePositions() {
        // Simple parallax or just static positioning?
        // For now, let's keep them static but correctly positioned.
        // We can add parallax on mouse move later if requested, but scroll parallax might be distracting with text.

        paperObjects.forEach(p => {
            p.element.style.top = `${p.initialY}px`;
            p.element.style.left = `${p.initialX}px`;
            p.element.style.transform = `rotateZ(${p.rotationZ}deg)`;
        });
    }

    // Mouse Parallax Effect
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < CONFIG.MOBILE_BREAKPOINT) return;

        const x = (e.clientX / window.innerWidth - 0.5) * 20; // range -10 to 10
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        mouseX = x;
        mouseY = y;

        requestAnimationFrame(() => {
            paperObjects.forEach((p, i) => {
                const depth = (i % 3) + 1; // 1, 2, or 3
                const moveX = mouseX * depth;
                const moveY = mouseY * depth;

                p.element.style.transform = `rotateZ(${p.rotationZ}deg) translate(${moveX}px, ${moveY}px)`;
            });
        });
    });

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    setupLayout();
    window.addEventListener('resize', debounce(setupLayout, 250));

    // --- Search Functionality ---
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const isSearching = query.length > 0;

        if (!isSearching) {
            // Restore original scattered layout
            papers.forEach((paper, index) => {
                const pObj = paperObjects[index];
                if (pObj) {
                    paper.style.opacity = '1';
                    paper.style.pointerEvents = 'auto';
                    paper.style.top = `${pObj.initialY}px`;
                    paper.style.left = `${pObj.initialX}px`;
                    paper.style.transform = `rotateZ(${pObj.rotationZ}deg)`;
                }
            });
            // Restore original container height
            setupLayout();
            return;
        }

        // Filter and Re-layout for Grid
        let matchCount = 0;
        const gridCols = CONFIG.DESKTOP.COLUMNS; // Reuse desktop columns
        const gridRowHeight = CONFIG.ROW_HEIGHT;

        // For grid layout, we center it based on viewport
        const viewportWidth = window.innerWidth;
        const roadWidthPx = viewportWidth * CONFIG.DESKTOP.ROAD_WIDTH;
        const horizontalMarginPx = (viewportWidth - roadWidthPx) / 2;

        papers.forEach((paper, index) => {
            const text = paper.innerText.toLowerCase();
            const url = paper.getAttribute('href').toLowerCase();
            const shouldShow = text.includes(query) || url.includes(query);

            if (shouldShow) {
                // Calculate grid position
                const col = matchCount % gridCols;
                const row = Math.floor(matchCount / gridCols);

                const xOffset = (roadWidthPx / gridCols) * col;
                const top = CONFIG.TOP_MARGIN + (row * gridRowHeight);
                const left = horizontalMarginPx + xOffset;

                paper.style.opacity = '1';
                paper.style.pointerEvents = 'auto';
                paper.style.top = `${top}px`;
                paper.style.left = `${left}px`;
                paper.style.transform = `rotateZ(0deg) scale(1)`; // No rotation for search results for clarity

                matchCount++;
            } else {
                paper.style.opacity = '0.05';
                paper.style.pointerEvents = 'none';
            }
        });

        // Adjust container height to fit the filtered grid
        const newHeight = CONFIG.TOP_MARGIN + (Math.ceil(matchCount / gridCols) * gridRowHeight) + CONFIG.TOP_MARGIN;
        container.style.height = `${newHeight}px`;
    });

    // Save original transform for restoring after search (if we decided to animate positions)
    // Currently, search just fades out non-matches without rearranging, which preserves the "scapyard" feel.


    // --- Canvas Animation (Digital Grid Rain) ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speed = Math.random() * 2 + 0.5;
                this.size = Math.random() * 2;
                this.color = `rgba(0, 240, 255, ${Math.random() * 0.5})`;
            }
            update() {
                this.y += this.speed;
                if (this.y > height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.size, this.size * 5); // elongated "rain" look
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.floor(width * 0.1); // Density
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateCanvas();
    }

    // --- Live Preview Logic ---
    const previewBackdrop = document.getElementById('preview-backdrop');
    const previewFrame = document.getElementById('preview-frame');
    let previewTimeout;

    if (previewBackdrop && previewFrame) {
        papers.forEach(paper => {
            paper.addEventListener('mouseenter', () => {
                if (window.innerWidth < CONFIG.MOBILE_BREAKPOINT) return;
                const url = paper.getAttribute('href');

                // Clear any existing timeout
                clearTimeout(previewTimeout);

                // Set new timeout to load preview
                previewTimeout = setTimeout(() => {
                    previewFrame.src = url;
                    previewBackdrop.style.opacity = '1';
                }, 1000); // 1s delay to prevent distraction
            });

            paper.addEventListener('mouseleave', () => {
                clearTimeout(previewTimeout);
                previewBackdrop.style.opacity = '0';
                // Optional: clear src after animation to save memory, or keep it for cache?
                // keeping it is better for flickering.
                setTimeout(() => {
                    if (previewBackdrop.style.opacity === '0') {
                        previewFrame.src = 'about:blank';
                    }
                }, 500);
            });
        });
    }
});