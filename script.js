// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Smooth Scrolling for Anchor Links
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

    // Mobile Menu Toggle Logic (Simples para visibilidade)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isDisplayed = window.getComputedStyle(navLinks).display !== 'none';
            if (isDisplayed) {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(5, 7, 7, 0.95)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid var(--border)';
            }
        });

        // Fechar menu ao clicar em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });
        
        // Resetar estilo ao redimensionar tela
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'row';
                navLinks.style.position = 'static';
                navLinks.style.backgroundColor = 'transparent';
                navLinks.style.padding = '0';
                navLinks.style.borderBottom = 'none';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }

    // Intersection Observer for scroll animations (Fade-in e microinterações)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    // Respeitar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Apply fade-in only if motion is allowed
        document.querySelectorAll('.section-header, .card, .timeline-item').forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            observer.observe(el);
        });
    // Timeline Progress Logic
    const timelineSection = document.querySelector('.experience.section');
    const timelineProgressBar = document.querySelector('.timeline-progress-fill');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineSection && timelineProgressBar) {
        if (prefersReducedMotion) {
            // Em reduced motion, deixamos a timeline totalmente preenchida
            timelineProgressBar.style.height = '100%';
            timelineItems.forEach(item => {
                const node = item.querySelector('.timeline-node');
                if (node) node.classList.add('active');
            });
        } else {
            // Lógica de preenchimento progressivo
            const updateTimeline = () => {
                const sectionRect = timelineSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Começa a preencher quando o topo da seção atinge o meio da tela
                const startPoint = windowHeight * 0.55; 
                
                const scrolledIntoSection = startPoint - sectionRect.top;
                const maxScroll = sectionRect.height;
                
                let progress = 0;
                if (scrolledIntoSection > 0) {
                    progress = Math.min(100, Math.max(0, (scrolledIntoSection / maxScroll) * 100));
                }
                
                timelineProgressBar.style.height = `${progress}%`;
                
                // Ativar os nós (dots) individualmente
                timelineItems.forEach(item => {
                    const itemRect = item.getBoundingClientRect();
                    const node = item.querySelector('.timeline-node');
                    
                    if (itemRect.top < startPoint && !node.classList.contains('active')) {
                        node.classList.add('active');
                    } else if (itemRect.top >= startPoint && node.classList.contains('active')) {
                        node.classList.remove('active');
                    }
                });
            };

            // Usando passive listener e requestAnimationFrame para performance
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateTimeline();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
            
            // Initial call
            updateTimeline();
        }
    }
});
