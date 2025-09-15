
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

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const expandedCard = document.querySelector('.event-card.expanded');
            if (expandedCard) {
                expandedCard.classList.remove('visible');
                setTimeout(() => {
                    expandedCard.classList.remove('expanded');
                    overlay.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }, 400);
            }
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

    // --- Part 5: Header and Navigation Scroll Effects (FIXED) ---
    const header = document.getElementById('main-header');
    const nav = document.querySelector('.alumni-nav');
    const body = document.body;
    let isScrolled = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Combined header, nav, and body scroll effects
        if (scrollY > 50) {
            if (!isScrolled) {
                header.classList.add('scrolled');
                nav.classList.add('scrolled');
                body.classList.add('scrolled');
                isScrolled = true;
            }
        } else {
            if (isScrolled) {
                header.classList.remove('scrolled');
                nav.classList.remove('scrolled');
                body.classList.remove('scrolled');
                isScrolled = false;
            }
        }
    });

    // --- Part 6: Improved Scroll-Spy Navigation Logic (FIXED) ---
    const navLinks = document.querySelectorAll('.alumni-nav a');
    const heroSection = document.querySelector('.hero-section');
    const pageSections = document.querySelectorAll('.page-section');
    const allSections = [heroSection, ...pageSections].filter(Boolean);

    const updateActiveLink = (targetId) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Handle home section specially (hero section should activate home)
            if ((targetId === 'hero-section' && href === '#home-content') || 
                href === `#${targetId}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            let targetSection = document.getElementById(targetId);
            
            // If clicking "Home", scroll to hero section instead
            if (targetId === 'home-content') {
                targetSection = heroSection || targetSection;
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Update active state immediately
            updateActiveLink(targetId === 'home-content' ? 'hero-section' : targetId);
        });
    });

    // Better section visibility observer for nav updates
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let targetId = entry.target.getAttribute('id');
                
                // If we're in the hero section, activate "Home"
                if (entry.target.classList.contains('hero-section') || !targetId) {
                    targetId = 'hero-section';
                }
                
                updateActiveLink(targetId);
            }
        });
    }, { 
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0.1 
    });

    // Observe all sections including hero
    allSections.forEach(section => {
        if (section) {
            scrollObserver.observe(section);
        }
    });

    // --- Part 7: Theme Toggle Functionality (ADDED) ---
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

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const expandedCard = document.querySelector('.event-card.expanded');
            if (expandedCard) {
                expandedCard.classList.remove('visible');
                setTimeout(() => {
                    expandedCard.classList.remove('expanded');
                    overlay.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }, 400);
            }
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

    // --- Part 5: Header and Navigation Scroll Effects (FIXED) ---
    const header = document.getElementById('main-header');
    const nav = document.querySelector('.alumni-nav');
    const body = document.body;
    let isScrolled = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Combined header, nav, and body scroll effects
        if (scrollY > 50) {
            if (!isScrolled) {
                header.classList.add('scrolled');
                nav.classList.add('scrolled');
                body.classList.add('scrolled');
                isScrolled = true;
            }
        } else {
            if (isScrolled) {
                header.classList.remove('scrolled');
                nav.classList.remove('scrolled');
                body.classList.remove('scrolled');
                isScrolled = false;
            }
        }
    });

    // --- Part 6: Improved Scroll-Spy Navigation Logic (FIXED) ---
    const navLinks = document.querySelectorAll('.alumni-nav a');
    const heroSection = document.querySelector('.hero-section');
    const pageSections = document.querySelectorAll('.page-section');
    const allSections = [heroSection, ...pageSections].filter(Boolean);

    const updateActiveLink = (targetId) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Handle home section specially (hero section should activate home)
            if ((targetId === 'hero-section' && href === '#home-content') || 
                href === `#${targetId}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            let targetSection = document.getElementById(targetId);
            
            // If clicking "Home", scroll to hero section instead
            if (targetId === 'home-content') {
                targetSection = heroSection || targetSection;
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Update active state immediately
            updateActiveLink(targetId === 'home-content' ? 'hero-section' : targetId);
        });
    });

    // Better section visibility observer for nav updates
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let targetId = entry.target.getAttribute('id');
                
                // If we're in the hero section, activate "Home"
                if (entry.target.classList.contains('hero-section') || !targetId) {
                    targetId = 'hero-section';
                }
                
                updateActiveLink(targetId);
            }
        });
    }, { 
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0.1 
    });

    // Observe all sections including hero
    allSections.forEach(section => {
        if (section) {
            scrollObserver.observe(section);
        }
    });

    // --- Part 7: Theme Toggle Functionality (ADDED) ---
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage?.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const newTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            if (localStorage) {
                localStorage.setItem('theme', newTheme);
            }
        });
    }

    // --- Part 8: Initialize Proper Active State on Load ---
    // Set initial active state based on scroll position
    const initialScrollY = window.scrollY;
    if (initialScrollY < 100) {
        // We're at the top, activate Home
        updateActiveLink('hero-section');
    }

    // --- Part 9: CTA Button Functionality ---
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const committeeSection = document.getElementById('committee-content');
            if (committeeSection) {
                committeeSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // --- Part 10: Handle Hash Navigation on Page Load ---
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                updateActiveLink(targetId);
            }
        }, 100);
    }
});

// --- Global Functions (for inline onclick handlers) ---
function moveSlide(direction) {
    if (window.moveSlide) {
        window.moveSlide(direction);
    }
}

    // --- Part 8: Initialize Proper Active State on Load ---
    // Set initial active state based on scroll position
    const initialScrollY = window.scrollY;
    if (initialScrollY < 100) {
        // We're at the top, activate Home
        updateActiveLink('hero-section');
    }

    // --- Part 9: CTA Button Functionality ---
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const committeeSection = document.getElementById('committee-content');
            if (committeeSection) {
                committeeSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // --- Part 10: Handle Hash Navigation on Page Load ---
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                updateActiveLink(targetId);
            }
        }, 100);
    }
});

// --- Global Functions (for inline onclick handlers) ---
function moveSlide(direction) {
    if (window.moveSlide) {
        window.moveSlide(direction);
    }
}
// Animated Counter for Stats Bar
document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.stats-bar');
  const numbers = document.querySelectorAll('.stat-number');
  
  const startCounter = (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      numbers.forEach(number => {
        const target = +number.getAttribute('data-target');
        let count = 0;
        const speed = 200; // Lower number is faster

        const updateCount = () => {
          const increment = Math.ceil(target / speed);
          
          if (count < target) {
            count += increment;
            if (count > target) {
              count = target;
            }
            number.innerText = count.toLocaleString() + (target > 1000 ? '+' : '');
            setTimeout(updateCount, 1);
          } else {
            number.innerText = target.toLocaleString() + (target > 1000 ? '+' : '');
          }
        };
        updateCount();
      });
      observer.unobserve(statsSection);
    });
  };

  const observer = new IntersectionObserver(startCounter, {
    root: null,
    threshold: 0.5,
  });

  if (statsSection) {
    observer.observe(statsSection);
  }
});
