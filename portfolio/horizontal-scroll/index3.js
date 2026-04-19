document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.main-wrapper');
    const panels = document.querySelectorAll('.panel');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentPanel = 0;
    let isScrolling = false;

    // --- Debounce function to limit scroll event firing ---
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // --- Main navigation function ---
    function navigateToPanel(panelIndex) {
        if (panelIndex >= 0 && panelIndex < panels.length) {
            currentPanel = panelIndex;
            const offset = -currentPanel * 100;
            wrapper.style.transform = `translateX(${offset}vw)`;

            // Update active navigation dot
            navDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPanel);
            });
        }
    }

    // --- Mouse wheel scroll handler for desktop ---
    const handleWheelScroll = debounce((event) => {
        if (isScrolling) return;
        isScrolling = true;

        if (event.deltaY > 0) { // Scrolling down/right
            if (currentPanel < panels.length - 1) {
                navigateToPanel(currentPanel + 1);
            }
        } else { // Scrolling up/left
            if (currentPanel > 0) {
                navigateToPanel(currentPanel - 1);
            }
        }
        
        setTimeout(() => { isScrolling = false; }, 1000); // Cooldown to prevent rapid scrolling
    }, 50);

    // --- Navigation dot click handler ---
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPanel(index);
        });
    });

    // --- Skills panel interaction logic ---
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillLists = document.querySelectorAll('.skill-list');

    function activateSkill(category) {
        skillCategories.forEach(cat => cat.classList.remove('active'));
        skillLists.forEach(list => list.classList.remove('active'));
        
        const targetCategory = document.querySelector(`.skill-category[data-category="${category}"]`);
        const targetList = document.getElementById(`${category}-skills`);
        
        if (targetCategory && targetList) {
            targetCategory.classList.add('active');
            targetList.classList.add('active');
        }
    }
    
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            activateSkill(category.dataset.category);
        });
        
        // For mobile click/tap
        category.addEventListener('click', () => {
             const wasActive = category.classList.contains('active');
             activateSkill(category.dataset.category);
             // On mobile, if you click the active one again, it should toggle the list
             const list = document.getElementById(`${category.dataset.category}-skills`);
             if(list) list.style.display = wasActive ? 'none' : 'block';
        });
    });
    
    // Default to first skill active on load
    activateSkill('frontend');

    // --- Mobile/Desktop detection ---
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    function handleScreenChange(e) {
        if (e.matches) {
            // Mobile view: disable horizontal scroll
            window.removeEventListener('wheel', handleWheelScroll);
            wrapper.style.transform = ''; // Reset transform
        } else {
            // Desktop view: enable horizontal scroll
            window.addEventListener('wheel', handleWheelScroll);
            navigateToPanel(currentPanel); // Re-apply current panel position
        }
    }
    
    mediaQuery.addEventListener('change', handleScreenChange);
    handleScreenChange(mediaQuery); // Initial check

});