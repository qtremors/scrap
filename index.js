// Layout configuration - adjust these to tweak the visual appearance
const CONFIG = {
    ROW_HEIGHT: 200,
    TOP_MARGIN: 350,
    MOBILE_BREAKPOINT: 768,
    DESKTOP: { COLUMNS: 5, ROAD_WIDTH: 0.8 },
    MOBILE: { COLUMNS: 1, ROAD_WIDTH: 0.9 },
};

document.addEventListener('DOMContentLoaded', () => {
    const papers = document.querySelectorAll('.project-card');
    let paperObjects = [];

    function setupLayout() {
        paperObjects = [];

        const isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;

        const numCols = isMobile ? CONFIG.MOBILE.COLUMNS : CONFIG.DESKTOP.COLUMNS;
        const roadWidthPercent = isMobile ? CONFIG.MOBILE.ROAD_WIDTH : CONFIG.DESKTOP.ROAD_WIDTH;
        const rowHeight = CONFIG.ROW_HEIGHT;
        const topMargin = CONFIG.TOP_MARGIN;

        const scrollHeight = topMargin + (papers.length * rowHeight) + topMargin;
        document.body.style.height = `${scrollHeight}px`;

        const viewportWidth = window.innerWidth;
        const roadWidthPx = viewportWidth * roadWidthPercent;
        const horizontalMarginPx = (viewportWidth - roadWidthPx) / 2;

        const pseudoRandom = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        papers.forEach((paper, index) => {
            const col = isMobile ? 0 : Math.floor(Math.random() * numCols);
            const xOffset = (roadWidthPx / numCols) * col;

            const initialY = topMargin + (index * rowHeight);
            const initialX = horizontalMarginPx + xOffset;

            const rotationZ = pseudoRandom(index + 100) * 20 - 10;
            const rotationY = pseudoRandom(index + 200) * 10 - 5;

            paperObjects.push({
                element: paper, initialX, initialY, rotationZ, rotationY, zIndex: 10 + index
            });
        });
        updatePositions();
    }

    function updatePositions() {
        const scrollY = window.scrollY;

        paperObjects.forEach(p => {
            const newY = p.initialY - scrollY;

            p.element.style.top = `${newY}px`;
            p.element.style.left = `${p.initialX}px`;
            p.element.style.transform = `rotateZ(${p.rotationZ}deg) rotateY(${p.rotationY}deg)`;
            p.element.style.zIndex = p.zIndex;
        });
    }

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    setupLayout();
    window.addEventListener('scroll', updatePositions, { passive: true });
    window.addEventListener('resize', debounce(setupLayout, 250));
});