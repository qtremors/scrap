document.addEventListener('DOMContentLoaded', function () {

    const body = document.body;
    const sections = document.querySelectorAll('section');
    const allNavLinks = document.querySelectorAll('.nav-item');
    const themeToggleButton = document.getElementById('theme-toggle');
    const mobileNavBar = document.querySelector('.navigation-bar');
    const topAppBar = document.querySelector('.top-app-bar');
    const md3ThemeToggle = document.querySelector('.theme-option');
    const mainStylesheet = document.getElementById('main-stylesheet');


    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };


    const toggleTheme = () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };


    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            // 1. User has a saved preference, so apply it.
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            // 2. No saved preference, but system prefers dark, so respect it.
            applyTheme('dark');
        } else {
            // 3. Neither a saved preference nor a dark system preference, so default to DARK.
            applyTheme('dark');
        }
    };


    const updateActiveNav = (visibleSectionId) => {
        allNavLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${visibleSectionId}`;
            link.classList.toggle('active', isActive);
        });
    };


    const handleNavVisibility = (currentScrollY, lastScrollY) => {
        const isScrollingDown = currentScrollY > lastScrollY;
        const isPastHeader = currentScrollY > topAppBar.offsetHeight;

        if (isScrollingDown && isPastHeader) {
            mobileNavBar.classList.add('hidden');
            topAppBar.classList.add('hidden');
        } else {
            mobileNavBar.classList.remove('hidden');
            topAppBar.classList.remove('hidden');
        }
    };


    let lastScrollY = window.scrollY;
    const scrollThreshold = 3;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) <= scrollThreshold) return;
        handleNavVisibility(currentScrollY, lastScrollY);
        lastScrollY = Math.max(currentScrollY, 0);
    };


    const debounce = (func, wait = 10) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };


    initializeTheme();

    themeToggleButton.addEventListener('click', toggleTheme);
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });


    if (md3ThemeToggle) {
        md3ThemeToggle.addEventListener('click', () => {
            const currentHref = mainStylesheet.getAttribute('href');
            const originalTheme = 'index.css';
            const alternateTheme = 'md3.css';

            if (currentHref && currentHref.includes(alternateTheme)) {
                mainStylesheet.setAttribute('href', originalTheme);
                console.log(`Switched stylesheet to: ${originalTheme}`);
            } else {
                mainStylesheet.setAttribute('href', alternateTheme);
                console.log(`Switched stylesheet to: ${alternateTheme}`);
            }
        });
    }


    window.addEventListener('scroll', debounce(handleScroll, 15));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNav(entry.target.getAttribute('id'));
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
});

