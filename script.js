// This ensures that the page scrolls to the top on refresh, preventing it from jumping to a section.
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Part 1: Image Slider Logic ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    function showSlide(slideIndex) {
        if (slides.length === 0) return;
        const validIndex = (slideIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === validIndex);
        });
        currentSlide = validIndex;
    }

    function moveSlide(n) {
        if (slides.length === 0) return;
        showSlide(currentSlide + n);
    }

    let slideInterval = setInterval(() => moveSlide(1), 5000);

    window.moveSlide = (n) => {
        moveSlide(n);
        clearInterval(slideInterval);
        slideInterval = setInterval(() => moveSlide(1), 5000);
    };

    if (slides.length > 0) {
        showSlide(0);
    }

    // --- Part 2: Expanding Card Logic ---
    const cards = document.querySelectorAll('.event-card');
    const overlay = document.querySelector('.modal-overlay');

    cards.forEach(card => {
        const closeButton = card.querySelector('.card-close-button');

        card.addEventListener('click', (event) => {
            if (event.target === closeButton || closeButton.contains(event.target)) {
                event.stopPropagation();
                return;
            }
            if (!card.classList.contains('expanded')) {
                card.classList.add('expanded');
                overlay.classList.add('active');
                document.body.classList.add('modal-open');
                setTimeout(() => card.classList.add('visible'), 10);
            }
        });

        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            card.classList.remove('visible');
            setTimeout(() => {
                card.classList.remove('expanded');
                overlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            }, 400);
        });
    });

    overlay.addEventListener('click', () => {
        const expandedCard = document.querySelector('.event-card.expanded');
        if (expandedCard) {
            expandedCard.classList.remove('visible');
             setTimeout(() => {
                expandedCard.classList.remove('expanded');
                overlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            }, 400);
        }
    });

    // --- Part 3: Animate Headings on Scroll (Legacy Support) ---
    const headings = document.querySelectorAll('.alumni-heading h1, .overview-text h2, .events h2');
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    headings.forEach(heading => {
        headingObserver.observe(heading);
    });

    // --- Part 4: Modern Animate on Scroll for New Elements ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        animateObserver.observe(element);
    });

    // --- Part 5: Header and Navigation Scroll Effects ---
    const header = document.getElementById('main-header');
    const nav = document.querySelector('.alumni-nav');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Header scroll effect
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Navigation scroll effect - this is the key addition!
        if (scrollY > 200) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Part 6: Scroll-Spy Navigation Logic ---
    const navLinks = document.querySelectorAll('.alumni-nav a');
    const pageSections = document.querySelectorAll('.page-section');

    const updateActiveLink = (targetId) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            updateActiveLink(targetId);
        });
    });

    // Section visibility observer for nav updates
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                updateActiveLink(targetId);
            }
        });
    }, { rootMargin: '-20% 0px -79% 0px' });

    pageSections.forEach(section => {
        scrollObserver.observe