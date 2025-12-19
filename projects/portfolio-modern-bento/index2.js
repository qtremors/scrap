document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    //  1. SCROLL REVEAL ANIMATION
    // =========================================================================
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is in the viewport, add the 'visible' class
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing the element after it has been revealed
                // observer.unobserve(entry.target); 
            } else {
                 // Optional: Remove class if you want animation to repeat on scroll up
                 entry.target.classList.remove('visible');
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe all elements with the 'reveal' class
    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(element => {
        revealObserver.observe(element);
    });


    // =========================================================================
    //  2. ACTIVE NAVIGATION LINK HIGHLIGHTING
    // =========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-item');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Find the corresponding nav link and add the active class
                // Use querySelector for robustness, in case a section doesn't have a nav link
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { 
        rootMargin: '-50% 0px -50% 0px' // Highlights when the section is in the middle of the viewport
    });

    // Observe all main sections
    sections.forEach(section => {
        if(section.id) { // Only observe sections that have an ID
            navObserver.observe(section);
        }
    });

});