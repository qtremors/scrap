document.addEventListener('DOMContentLoaded', () => {

    const sections = document.querySelectorAll('.terminal-section');
    const navLinks = document.querySelectorAll('.terminal-nav .nav-item');

    // =========================================================================
    //  1. Animate sections on scroll
    // =========================================================================
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.15
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // =========================================================================
    //  2. Update active navigation link on scroll
    // =========================================================================
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to the corresponding nav link
                const activeLink = document.querySelector(`.terminal-nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px', // Activates when the middle of the section is in the middle of the viewport
        threshold: 0
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });

});