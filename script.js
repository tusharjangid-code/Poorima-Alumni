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

    // --- Part 3: Animate Headings on Scroll ---
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

    // --- Part 4: Scroll-Spy Navigation Logic ---
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
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href').substring(1);
            updateActiveLink(targetId);
        });
    });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                updateActiveLink(targetId);
            }
        });
    }, { rootMargin: '-20% 0px -79% 0px' });

    pageSections.forEach(section => {
        scrollObserver.observe(section);
    });

    // --- Part 5: Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle.querySelector('.sun');
    const moonIcon = themeToggle.querySelector('.moon');

    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    };

    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-theme');
        setTheme(isDarkMode ? 'light' : 'dark');
    });

    // On page load, check for saved theme
    const savedTheme = localStorage.getItem('theme');
    // Also check user's system preference if no theme is saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});

