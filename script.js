// script.js
document.addEventListener('DOMContentLoaded', () => {
    // === Theme Toggle Logic ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check system preference
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) {
            // Uncomment to allow system preference to override default dark mode
            // htmlElement.setAttribute('data-theme', 'light');
        }
    }
    
    updateThemeIcon();

    // Toggle event listener
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const iconWrapper = document.getElementById('theme-toggle');
        
        // Remove existing icon
        iconWrapper.innerHTML = '';
        
        // Create new icon based on theme
        const icon = document.createElement('i');
        if (currentTheme === 'dark') {
            icon.setAttribute('data-lucide', 'sun'); // Show sun to toggle to light
        } else {
            icon.setAttribute('data-lucide', 'moon'); // Show moon to toggle to dark
        }
        
        iconWrapper.appendChild(icon);
        // Re-initialize Lucide icons for the new element
        lucide.createIcons();
    }

    // === Smooth Scrolling for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
