/**
 * Layout Configuration
 * These values control the card grid layout on the page
 */
const CONFIG = {
    ROW_HEIGHT: 250,            // Height of each row in the card grid (px)
    TOP_MARGIN: 100,            // Top margin before first row (px)
    MOBILE_BREAKPOINT: 768,     // Below this width, switch to mobile layout
    DESKTOP: {
        COLUMNS: 4,             // Number of columns in desktop grid
        ROAD_WIDTH: 0.9         // Percentage of viewport used for cards (90%)
    },
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
    const clearBtn = document.getElementById('clear-search');
    const projectCount = document.getElementById('project-count');
    const totalProjects = papers.length;

    function updateProjectCount(showing, total) {
        if (showing === total) {
            projectCount.textContent = `${total} PROJECTS`;
        } else {
            projectCount.textContent = `SHOWING ${showing} OF ${total} PROJECTS`;
        }
    }

    // Initial count
    updateProjectCount(totalProjects, totalProjects);

    // Clear search button
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });

    // --- Category Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    let activeFilter = 'all';

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        let matchCount = 0;
        const gridCols = CONFIG.DESKTOP.COLUMNS;
        const gridRowHeight = CONFIG.ROW_HEIGHT;
        const viewportWidth = window.innerWidth;
        const roadWidthPx = viewportWidth * CONFIG.DESKTOP.ROAD_WIDTH;
        const horizontalMarginPx = (viewportWidth - roadWidthPx) / 2;

        papers.forEach((paper, index) => {
            const text = paper.innerText.toLowerCase();
            const url = paper.getAttribute('href').toLowerCase();
            const category = paper.getAttribute('data-category');

            const matchesSearch = query.length === 0 || text.includes(query) || url.includes(query);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const shouldShow = matchesSearch && matchesFilter;

            if (shouldShow) {
                if (query.length > 0 || activeFilter !== 'all') {
                    // Grid layout for filtered results
                    const col = matchCount % gridCols;
                    const row = Math.floor(matchCount / gridCols);
                    const xOffset = (roadWidthPx / gridCols) * col;
                    const top = CONFIG.TOP_MARGIN + (row * gridRowHeight);
                    const left = horizontalMarginPx + xOffset;

                    paper.style.opacity = '1';
                    paper.style.pointerEvents = 'auto';
                    paper.style.top = `${top}px`;
                    paper.style.left = `${left}px`;
                    paper.style.transform = `rotateZ(0deg) scale(1)`;
                } else {
                    // Restore scattered layout
                    const pObj = paperObjects[index];
                    if (pObj) {
                        paper.style.opacity = '1';
                        paper.style.pointerEvents = 'auto';
                        paper.style.top = `${pObj.initialY}px`;
                        paper.style.left = `${pObj.initialX}px`;
                        paper.style.transform = `rotateZ(${pObj.rotationZ}deg)`;
                    }
                }
                matchCount++;
            } else {
                paper.style.opacity = '0.05';
                paper.style.pointerEvents = 'none';
            }
        });

        updateProjectCount(matchCount, totalProjects);

        if (query.length > 0 || activeFilter !== 'all') {
            const newHeight = CONFIG.TOP_MARGIN + (Math.ceil(matchCount / gridCols) * gridRowHeight) + CONFIG.TOP_MARGIN;
            container.style.height = `${newHeight}px`;
        } else {
            setupLayout();
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    // Override search input to use combined filter
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        clearBtn.style.display = query.length > 0 ? 'block' : 'none';
        applyFilters();
    });

    // Save original transform for restoring after search (if we decided to animate positions)
    // Currently, search just fades out non-matches without rearranging, which preserves the "scapyard" feel.


    // --- Canvas Animation (Digital Grid Rain) ---
    // GPU Optimized: 30fps, fewer particles
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationId = null;
        let isTabVisible = true;
        let lastFrameTime = 0;
        const TARGET_FPS = 30;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speed = Math.random() * 3 + 1; // Faster to compensate for lower FPS
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.y += this.speed;
                if (this.y > height) this.y = 0;
            }
            draw() {
                ctx.fillRect(this.x, this.y, this.size, this.size * 4);
            }
        }

        function initParticles() {
            particles = [];
            // Reduced to 80 particles max for better GPU performance
            const count = Math.min(Math.floor(width * 0.05), 80);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateCanvas(timestamp) {
            if (!isTabVisible) return;

            // Throttle to 30fps
            const elapsed = timestamp - lastFrameTime;
            if (elapsed < FRAME_INTERVAL) {
                animationId = requestAnimationFrame(animateCanvas);
                return;
            }
            lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animateCanvas);
        }

        // Pause animation when tab is hidden
        document.addEventListener('visibilitychange', () => {
            isTabVisible = !document.hidden;
            if (isTabVisible && !animationId) {
                lastFrameTime = performance.now();
                animateCanvas(lastFrameTime);
            } else if (!isTabVisible && animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateCanvas(0);
    }

    // --- Live Preview Logic ---
    const previewBackdrop = document.getElementById('preview-backdrop');
    const previewFrame = document.getElementById('preview-frame');
    let previewTimeout;
    let clearFrameTimeout;
    let isPreviewActive = false;

    if (previewBackdrop && previewFrame) {
        papers.forEach(paper => {
            paper.addEventListener('mouseenter', () => {
                if (window.innerWidth < CONFIG.MOBILE_BREAKPOINT) return;
                const url = paper.getAttribute('href');

                // Cancel any pending clear
                clearTimeout(clearFrameTimeout);
                clearTimeout(previewTimeout);

                // Set new timeout to load preview
                previewTimeout = setTimeout(() => {
                    isPreviewActive = true;
                    previewFrame.src = url;
                    previewBackdrop.style.opacity = '1';
                }, 1000); // 1s delay to prevent distraction
            });

            paper.addEventListener('mouseleave', () => {
                clearTimeout(previewTimeout);
                previewBackdrop.style.opacity = '0';
                isPreviewActive = false;

                // Clear src only if not re-entering another card
                clearFrameTimeout = setTimeout(() => {
                    if (!isPreviewActive) {
                        previewFrame.src = 'about:blank';
                    }
                }, 500);
            });
        });
    }
});