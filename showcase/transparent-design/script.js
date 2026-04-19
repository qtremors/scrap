document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor-light');
    const coordX = document.getElementById('coord-x');
    const coordY = document.getElementById('coord-y');
    const internals = document.querySelector('.circuit-bg');
    
    // Mouse movement handler
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Move cursor light
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';

        // Update coordinates tracker
        coordX.textContent = 'X: ' + String(x).padStart(4, '0');
        coordY.textContent = 'Y: ' + String(y).padStart(4, '0');

        // Parallax Effect for Internals
        // Move background slightly opposite to mouse to simulate depth (it's "further away")
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (x - centerX) * 0.05; // Gentle movement
        const moveY = (y - centerY) * 0.05;

        internals.style.transform = `translate(${-moveX}px, ${-moveY}px) scale(1.1)`;
    });

    // Randomize bar charts periodically
    const bars = document.querySelectorAll('.bar');
    
    setInterval(() => {
        bars.forEach(bar => {
            const randomHeight = Math.floor(Math.random() * 80) + 20; // 20% to 100%
            bar.style.height = `${randomHeight}%`;
        });
    }, 2000);

    // Glitch text effect on hover
    const glitchTitle = document.querySelector('.glitch');
    const originalText = glitchTitle.getAttribute('data-text');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    glitchTitle.addEventListener('mouseover', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            glitchTitle.innerText = glitchTitle.innerText.split('')
                .map((letter, index) => {
                    if(index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * 36)];
                })
                .join('');
            
            if(iterations >= originalText.length){ 
                clearInterval(interval);
            }
            
            iterations += 1/3; 
        }, 30);
    });
});
