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

    // Mobile navigation drawer
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileViewport = window.matchMedia('(max-width: 768px)');

    if (mobileMenuBtn && navLinks && mobileMenuOverlay) {
        const setMenuOpen = (isOpen, returnFocus = false) => {
            navLinks.classList.toggle('is-open', isOpen);
            mobileMenuOverlay.hidden = !isOpen;
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
            mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
            mobileMenuBtn.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
            lucide.createIcons();

            if (returnFocus) mobileMenuBtn.focus();
        };

        mobileMenuBtn.addEventListener('click', () => {
            setMenuOpen(mobileMenuBtn.getAttribute('aria-expanded') !== 'true');
            if (mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
                navLinks.querySelector('a').focus();
            }
        });

        mobileMenuOverlay.addEventListener('click', () => setMenuOpen(false, true));

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.querySelectorAll('a').forEach(navLink => {
                    navLink.removeAttribute('aria-current');
                });
                link.setAttribute('aria-current', 'location');
                link.classList.remove('is-flashing');
                void link.offsetWidth;
                link.classList.add('is-flashing');

                if (mobileViewport.matches) setMenuOpen(false, true);
            });
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
                setMenuOpen(false, true);
            }
        });

        mobileViewport.addEventListener('change', event => {
            if (!event.matches) setMenuOpen(false);
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
    }

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
