/* ==========================================================================
   INDEX LITE - Main JavaScript
   ========================================================================== */

/**
 * Theme Synchronization
 * Runs immediately to prevent FOUC
 */
(function () {
    var themePref = localStorage.getItem('theme_pref') || 'system';
    var isDark = false;

    if (themePref === 'dark') {
        isDark = true;
    } else if (themePref === 'light') {
        isDark = false;
    } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

/**
 * DOM Ready Handler
 */
document.addEventListener('DOMContentLoaded', function () {
    // Restore scroll position if passed (for transition visual continuity)
    var urlParams = new URLSearchParams(window.location.search);
    var scrollPos = urlParams.get('scroll');
    if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos, 10));
    }

    initLoadMore();
    initPageTransitions();
    initScrollHighlighting();
    initSmoothScroll();
});

/**
 * Load More Projects Toggle
 */
function initLoadMore() {
    var btn = document.getElementById('load-more-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
        var hidden = document.getElementById('hidden-projects');
        if (hidden.style.display === 'none') {
            hidden.style.display = 'block';
            this.textContent = 'Show Less';
        } else {
            hidden.style.display = 'none';
            this.textContent = 'Load More Projects...';
        }
    });
}

/**
 * Page Navigation (Direct)
 */
function initPageTransitions() {
    var backLinks = document.querySelectorAll('#back-to-main, #footer-back-link, #mobile-back-btn');

    backLinks.forEach(function (backLink) {
        if (backLink) {
            backLink.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        }
    });
}


/**
 * Scroll Highlighting for TOC
 */
function initScrollHighlighting() {
    var tocNav = document.getElementById('toc-nav');
    if (!tocNav) return;

    var tocLinks = tocNav.querySelectorAll('a[href^="#"]');
    var sections = [];

    tocLinks.forEach(function (link) {
        var id = link.getAttribute('href').substring(1);
        var section = document.getElementById(id); // Target the heading ID
        if (section) {
            // Observe the parent section to capture the full content area
            sections.push(section.closest('section') || section);
        }
    });

    if (sections.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Remove active from all
                tocLinks.forEach(function (link) {
                    link.classList.remove('active');
                });

                // Find which link corresponds to this section
                var heading = entry.target.querySelector('h1[id], h2[id], h3[id]') || entry.target;
                var id = heading.id;

                var activeLink = tocNav.querySelector('a[href="#' + id + '"]');
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -45% 0px' }); // Highlight what is in the vertical center

    sections.forEach(function (section) {
        observer.observe(section);
    });

    // Fallback: Check if bottom of page is reached
    window.addEventListener('scroll', function () {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            tocLinks.forEach(function (link) { link.classList.remove('active'); });
            var lastLink = tocLinks[tocLinks.length - 1];
            if (lastLink) lastLink.classList.add('active');
        }
    });
}

/**
 * Smooth Scroll for TOC Links
 */
function initSmoothScroll() {
    var tocNav = document.getElementById('toc-nav');
    if (!tocNav) return;

    tocNav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();

            // Manual Highlight
            tocNav.querySelectorAll('a').forEach(function (l) { l.classList.remove('active'); });
            e.target.classList.add('active');

            var id = e.target.getAttribute('href').substring(1);
            var target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}
