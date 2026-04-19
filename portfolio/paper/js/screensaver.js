/* ==========================================================================
   SCREENSAVER - DVD Bouncing ASCII Art
   Activates after 1 minute of inactivity
   ========================================================================== */

(function () {
    'use strict';

    // Configuration
    const IDLE_TIMEOUT = 60000;  // 1 minute in milliseconds
    const SPEED = 2;             // Movement speed (pixels per frame)
    const FPS = 60;              // Target frames per second

    // Color palette for the bouncing effect
    const COLORS = [
        '#8ab4f8',  // Blue (main theme color)
        '#50fa7b',  // Green
        '#ff79c6',  // Pink
        '#f1fa8c',  // Yellow
        '#bd93f9',  // Purple
        '#ffb86c',  // Orange
        '#00d4ff',  // Cyan
        '#ff5555',  // Red
    ];

    // ASCII Art - Tremors Logo
    const ASCII_ART = `
████████╗██████╗ ███████╗███╗   ███╗ ██████╗ ██████╗ ███████╗
╚══██╔══╝██╔══██╗██╔════╝████╗ ████║██╔═══██╗██╔══██╗██╔════╝
   ██║   ██████╔╝█████╗  ██╔████╔██║██║   ██║██████╔╝███████╗
   ██║   ██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗╚════██║
   ██║   ██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║███████║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                  Python Developer ✦ Full Stack
    `.trim();

    // State
    let idleTimer = null;
    let animationId = null;
    let screensaverEl = null;
    let asciiEl = null;
    let position = { x: 100, y: 100 };
    let velocity = { x: SPEED, y: SPEED };
    let currentColorIndex = 0;
    let isActive = false;

    /**
     * Initialize the screensaver
     */
    function init() {
        createScreensaverElement();
        bindEvents();
        resetIdleTimer();
    }

    /**
     * Create the screensaver DOM elements
     */
    function createScreensaverElement() {
        // Create main container
        screensaverEl = document.createElement('div');
        screensaverEl.id = 'screensaver';

        // Create ASCII container
        asciiEl = document.createElement('div');
        asciiEl.className = 'screensaver-ascii';
        asciiEl.textContent = ASCII_ART;
        asciiEl.style.color = COLORS[0];

        // Create hint text
        const hintEl = document.createElement('div');
        hintEl.className = 'screensaver-hint';
        hintEl.textContent = 'Move mouse or press any key to exit';

        screensaverEl.appendChild(asciiEl);
        screensaverEl.appendChild(hintEl);
        document.body.appendChild(screensaverEl);
    }

    /**
     * Bind user activity events
     */
    function bindEvents() {
        const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'];
        
        activityEvents.forEach(eventType => {
            document.addEventListener(eventType, handleUserActivity, { passive: true });
        });
    }

    /**
     * Handle any user activity
     */
    function handleUserActivity() {
        if (isActive) {
            hideScreensaver();
        }
        resetIdleTimer();
    }

    /**
     * Reset the idle timer
     */
    function resetIdleTimer() {
        if (idleTimer) {
            clearTimeout(idleTimer);
        }
        idleTimer = setTimeout(showScreensaver, IDLE_TIMEOUT);
    }

    /**
     * Show the screensaver
     */
    function showScreensaver() {
        if (isActive) return;
        
        isActive = true;
        
        // Random starting position
        const rect = getAsciiDimensions();
        position.x = Math.random() * (window.innerWidth - rect.width);
        position.y = Math.random() * (window.innerHeight - rect.height);
        
        // Random starting direction
        velocity.x = (Math.random() > 0.5 ? 1 : -1) * SPEED;
        velocity.y = (Math.random() > 0.5 ? 1 : -1) * SPEED;

        screensaverEl.classList.add('active');
        startAnimation();
    }

    /**
     * Hide the screensaver
     */
    function hideScreensaver() {
        if (!isActive) return;
        
        isActive = false;
        screensaverEl.classList.remove('active');
        stopAnimation();
    }

    /**
     * Get the dimensions of the ASCII art element
     */
    function getAsciiDimensions() {
        const rect = asciiEl.getBoundingClientRect();
        return {
            width: rect.width || 400,
            height: rect.height || 150
        };
    }

    /**
     * Start the bouncing animation
     */
    function startAnimation() {
        const frameInterval = 1000 / FPS;
        let lastFrameTime = 0;

        function animate(timestamp) {
            if (!isActive) return;

            // Throttle to target FPS
            if (timestamp - lastFrameTime < frameInterval) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = timestamp;

            const rect = getAsciiDimensions();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            // Update position
            position.x += velocity.x;
            position.y += velocity.y;

            // Check for collisions and bounce
            let bounced = false;

            if (position.x <= 0) {
                position.x = 0;
                velocity.x = Math.abs(velocity.x);
                bounced = true;
            } else if (position.x >= maxX) {
                position.x = maxX;
                velocity.x = -Math.abs(velocity.x);
                bounced = true;
            }

            if (position.y <= 0) {
                position.y = 0;
                velocity.y = Math.abs(velocity.y);
                bounced = true;
            } else if (position.y >= maxY) {
                position.y = maxY;
                velocity.y = -Math.abs(velocity.y);
                bounced = true;
            }

            // Change color on bounce (like DVD logo!)
            if (bounced) {
                currentColorIndex = (currentColorIndex + 1) % COLORS.length;
                asciiEl.style.color = COLORS[currentColorIndex];
            }

            // Apply position
            asciiEl.style.transform = `translate(${position.x}px, ${position.y}px)`;

            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
    }

    /**
     * Stop the animation
     */
    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose toggle function for debugging
    window.toggleScreensaver = function() {
        if (isActive) {
            hideScreensaver();
        } else {
            showScreensaver();
        }
    };
})();
