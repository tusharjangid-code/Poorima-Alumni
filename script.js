
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

    window.controlSlider = (n) => {
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
// Wait for the page to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get all the elements we need to work with
    const galleryModal = document.getElementById('galleryModal');
    const openCard = document.getElementById('openGalleryCard');
    const closeButton = document.querySelector('#galleryModal .close-button');
    const mediaDisplay = document.getElementById('mainMediaDisplay');
    const thumbnails = document.querySelectorAll('.thumbnail');

    // This function updates the main display with a photo or video
    const showMedia = (thumb) => {
        const type = thumb.dataset.type;
        const src = thumb.dataset.src;

        // Clear out the previous media
        mediaDisplay.innerHTML = '';

        if (type === 'image') {
            const img = document.createElement('img');
            img.src = src;
            mediaDisplay.appendChild(img);
        } else if (type === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true; // Show play/pause controls
            video.autoplay = true; // Make the video play automatically
            mediaDisplay.appendChild(video);
        }

        // Highlight the active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    };

    // --- Event Listeners ---
    
    // 1. When the "Annual Grand Meet" card is clicked, open the gallery
    if (openCard) {
        openCard.addEventListener('click', () => {
            galleryModal.style.display = 'block';
            // Show the first item by default
            if (thumbnails.length > 0) {
                showMedia(thumbnails[0]);
            }
        });
    }

    // 2. When a thumbnail is clicked, show that media
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            showMedia(thumb);
        });
    });

    // 3. When the 'X' button is clicked, close the gallery
    const closeGallery = () => {
        galleryModal.style.display = 'none';
        mediaDisplay.innerHTML = ''; // Stop video/remove content
    };

    if (closeButton) {
        closeButton.addEventListener('click', closeGallery);
    }
    
    // 4. Also close gallery if user clicks on the dark background
    window.addEventListener('click', (event) => {
        if (event.target === galleryModal) {
            closeGallery();
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    
    // Gallery elements
    const galleryModal = document.getElementById('galleryModal');
    const openGalleryCard = document.getElementById('openGalleryCard');
    const closeButton = document.querySelector('.gallery-close-button');
    const mainDisplay = document.getElementById('mainMediaDisplay');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevMedia');
    const nextBtn = document.getElementById('nextMedia');
    const mediaCaption = document.getElementById('mediaCaption');
    const mediaCounter = document.getElementById('mediaCounter');
    
    let currentMediaIndex = 0;
    let mediaData = [];
    
    // Initialize media data from thumbnails
    const initializeGallery = () => {
        mediaData = Array.from(thumbnails).map((thumb, index) => ({
            type: thumb.dataset.type,
            src: thumb.dataset.src,
            caption: thumb.dataset.caption || `Image ${index + 1}`,
            element: thumb
        }));
    };
    
    // Show specific media by index
    const showMedia = (index) => {
        if (!mediaData[index]) return;
        
        const media = mediaData[index];
        currentMediaIndex = index;
        
        // Clear previous content
        mainDisplay.innerHTML = '';
        
        // Create and display media element
        if (media.type === 'image') {
            const img = document.createElement('img');
            img.src = media.src;
            img.alt = media.caption;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
            
            mainDisplay.appendChild(img);
        } else if (media.type === 'video') {
            const video = document.createElement('video');
            video.src = media.src;
            video.controls = true;
            video.autoplay = true;
            video.style.opacity = '0';
            video.style.transition = 'opacity 0.3s ease';
            
            video.onloadeddata = () => {
                video.style.opacity = '1';
            };
            
            mainDisplay.appendChild(video);
        }
        
        // Update thumbnails
        thumbnails.forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === index);
        });
        
        // Update info
        updateMediaInfo();
    };
    
    // Update media caption and counter
    const updateMediaInfo = () => {
        if (!mediaData[currentMediaIndex]) return;
        
        const media = mediaData[currentMediaIndex];
        mediaCaption.textContent = media.caption;
        mediaCounter.textContent = `${currentMediaIndex + 1} of ${mediaData.length}`;
    };
    
    // Navigate to previous media
    const showPrevious = () => {
        const newIndex = currentMediaIndex > 0 ? currentMediaIndex - 1 : mediaData.length - 1;
        showMedia(newIndex);
    };
    
    // Navigate to next media
    const showNext = () => {
        const newIndex = currentMediaIndex < mediaData.length - 1 ? currentMediaIndex + 1 : 0;
        showMedia(newIndex);
    };
    
    // Open gallery modal
    const openGallery = () => {
        if (!mediaData.length) {
            initializeGallery();
        }
        
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Smooth fade in
        setTimeout(() => {
            galleryModal.classList.add('active');
        }, 10);
        
        // Show first media
        showMedia(0);
    };
    
    // Close gallery modal
    const closeGallery = () => {
        galleryModal.classList.remove('active');
        
        setTimeout(() => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scroll
            mainDisplay.innerHTML = ''; // Clear media to stop videos
        }, 400);
    };
    
    // Event Listeners
    if (openGalleryCard) {
        openGalleryCard.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openGallery();
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeGallery);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevious);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNext);
    }
    
    // Thumbnail click events
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            showMedia(index);
        });
    });
    
    // Close gallery when clicking outside content
    galleryModal?.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeGallery();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (galleryModal?.style.display === 'block' && galleryModal.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeGallery();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    showPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    showNext();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    showNext();
                    break;
            }
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleSwipe = () => {
        const swipeThreshold = 50; // Minimum swipe distance
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                showPrevious(); // Swipe right = previous
            } else {
                showNext(); // Swipe left = next
            }
        }
    };
    
    if (mainDisplay) {
        mainDisplay.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        mainDisplay.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    // Prevent context menu on images (optional)
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' && galleryModal?.style.display === 'block') {
            e.preventDefault();
        }
    });
    
    // Initialize gallery on load
    initializeGallery();
});

// ========================================= 
// --- Additional Gallery Utilities ---
// =========================================

// Function to dynamically add new media to gallery (if needed)
function addMediaToGallery(type, src, caption) {
    const galleryThumbnails = document.querySelector('.gallery-thumbnails');
    if (!galleryThumbnails) return;
    
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.dataset.type = type;
    thumbnail.dataset.src = src;
    thumbnail.dataset.caption = caption || 'New Media';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = caption || 'New Media';
    
    if (type === 'video') {
        const playIcon = document.createElement('div');
        playIcon.className = 'play-icon';
        playIcon.textContent = '▶';
        thumbnail.appendChild(playIcon);
    }
    
    thumbnail.appendChild(img);
    galleryThumbnails.appendChild(thumbnail);
    
    // Reinitialize gallery
    const event = new CustomEvent('galleryUpdate');
    document.dispatchEvent(event);
}

// Listen for gallery updates
document.addEventListener('galleryUpdate', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Reinitialize event listeners for new thumbnails
    thumbnails.forEach((thumb, index) => {
        thumb.removeEventListener('click', null); // Remove existing listeners
        thumb.addEventListener('click', () => {
            const galleryModal = document.getElementById('galleryModal');
            if (galleryModal?.style.display === 'block') {
                // Gallery is open, show this media
                showMedia(index);
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const CONFIG = {
        // Replace with your actual Google Form URL
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_FORM_ID/viewform?embedded=true',
        
        // Google Maps embed URL for Poornima University
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.8567889567!2d75.6876!3d26.8467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5c1c06c3b4d%3A0x2b1f4f1c06c3b4d!2sPoornima%20University!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
        
        // Coordinates for Poornima University
        coordinates: { lat: 26.8467, lng: 75.6876 },
        
        // Contact details
        phone: '9799546261',
        email: 'alumni@poornima.edu.in',
        address: 'IS-2027, Ramchandrapura, Jaipur, Rajasthan 302022'
    };

    // DOM Elements
    const elements = {
        contactButtons: document.querySelectorAll('.contact-btn'),
        emailCard: document.getElementById('emailCard'),
        addressCard: document.getElementById('addressCard'),
        googleFormContainer: document.getElementById('googleFormContainer'),
        mapContainer: document.getElementById('mapContainer'),
        googleFormFrame: document.getElementById('googleFormFrame'),
        mapFrame: document.getElementById('mapFrame'),
        contactModal: document.getElementById('contactModal'),
        contactForm: document.getElementById('contactForm'),
        submitBtn: document.querySelector('.submit-btn'),
        closeButtons: document.querySelectorAll('.close-interactive'),
        modalCloseButton: document.querySelector('.contact-close-button'),
        getDirectionsBtn: document.getElementById('getDirections'),
        viewLargerMapBtn: document.getElementById('viewLargerMap')
    };

    // Utility Functions
    const utils = {
        showElement(element, callback) {
            if (!element) return;
            
            element.style.display = 'block';
            requestAnimationFrame(() => {
                element.classList.add('active');
                if (callback) setTimeout(callback, 500);
            });
            
            // Smooth scroll to element
            setTimeout(() => {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
            }, 100);
        },

        hideElement(element, callback) {
            if (!element) return;
            
            element.classList.remove('active');
            setTimeout(() => {
                element.style.display = 'none';
                if (callback) callback();
            }, 500);
        },

        openModal(modal) {
            if (!modal) return;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        },

        closeModal(modal) {
            if (!modal) return;
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 400);
        },

        createNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">
                        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <span class="notification-message">${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-100%)';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
            
            // Close button functionality
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-100%)';
                setTimeout(() => notification.remove(), 300);
            });
            
            // Show animation
            requestAnimationFrame(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            });
        },

        formatPhoneNumber(phone) {
            return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    };

    // Contact Button Handlers
    const contactHandlers = {
        email() {
            // Show both Google Form and modal options
            const userChoice = confirm('Would you like to fill out our Google Form (OK) or use our contact form (Cancel)?');
            
            if (userChoice) {
                // Load and show Google Form
                if (!elements.googleFormFrame.src) {
                    elements.googleFormFrame.src = CONFIG.googleFormUrl;
                }
                utils.showElement(elements.googleFormContainer);
                utils.createNotification('Loading Google Form...', 'info');
            } else {
                // Show contact modal
                utils.openModal(elements.contactModal);
            }
        },

        phone() {
            const phoneNumber = CONFIG.phone;
            const formattedPhone = utils.formatPhoneNumber(phoneNumber);
            
            // Create phone action modal
            const phoneModal = document.createElement('div');
            phoneModal.className = 'phone-action-modal';
            phoneModal.innerHTML = `
                <div class="phone-modal-content">
                    <h3>Contact Us</h3>
                    <p>Call us at: <strong>${formattedPhone}</strong></p>
                    <div class="phone-actions">
                        <button onclick="window.open('tel:+91${phoneNumber}')" class="action-btn call-btn">
                            📞 Call Now
                        </button>
                        <button onclick="window.open('https://wa.me/91${phoneNumber}')" class="action-btn whatsapp-btn">
                            📱 WhatsApp
                        </button>
                        <button onclick="navigator.clipboard.writeText('${phoneNumber}').then(() => alert('Phone number copied!'))" class="action-btn copy-btn">
                            📋 Copy Number
                        </button>
                    </div>
                    <button class="close-phone-modal">&times;</button>
                </div>
            `;
            
            document.body.appendChild(phoneModal);
            
            // Show modal with animation
            requestAnimationFrame(() => {
                phoneModal.classList.add('active');
            });
            
            // Close functionality
            const closePhoneModal = () => {
                phoneModal.classList.remove('active');
                setTimeout(() => phoneModal.remove(), 300);
            };
            
            phoneModal.querySelector('.close-phone-modal').addEventListener('click', closePhoneModal);
            phoneModal.addEventListener('click', (e) => {
                if (e.target === phoneModal) closePhoneModal();
            });
            
            // Auto close after 10 seconds
            setTimeout(closePhoneModal, 10000);
        },

        map() {
            // Load and show map
            if (!elements.mapFrame.src) {
                elements.mapFrame.src = CONFIG.mapUrl;
                utils.createNotification('Loading interactive map...', 'info');
            }
            utils.showElement(elements.mapContainer);
        }
    };

    // Event Listeners Setup
    const setupEventListeners = () => {
        // Contact button clicks
        elements.contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = button.getAttribute('data-action');
                
                // Add click animation
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
                
                // Execute action
                if (contactHandlers[action]) {
                    contactHandlers[action]();
                }
            });
        });

        // Close interactive elements
        elements.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    utils.hideElement(targetElement);
                }
            });
        });

        // Modal close functionality
        if (elements.modalCloseButton) {
            elements.modalCloseButton.addEventListener('click', () => {
                utils.closeModal(elements.contactModal);
            });
        }

        // Close modal on outside click
        if (elements.contactModal) {
            elements.contactModal.addEventListener('click', (e) => {
                if (e.target === elements.contactModal) {
                    utils.closeModal(elements.contactModal);
                }
            });
        }

        // Form submission
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleFormSubmission);
        }

        // Map quick actions
        if (elements.getDirectionsBtn) {
            elements.getDirectionsBtn.addEventListener('click', () => {
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.coordinates.lat},${CONFIG.coordinates.lng}`;
                window.open(directionsUrl, '_blank');
                utils.createNotification('Opening directions in new tab...', 'info');
            });
        }

        if (elements.viewLargerMapBtn) {
            elements.viewLargerMapBtn.addEventListener('click', () => {
                const largerMapUrl = `https://www.google.com/maps/search/?api=1&query=${CONFIG.coordinates.lat},${CONFIG.coordinates.lng}`;
                window.open(largerMapUrl, '_blank');
                utils.createNotification('Opening larger map in new tab...', 'info');
            });
        }

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals or interactive elements
                if (elements.contactModal && elements.contactModal.classList.contains('active')) {
                    utils.closeModal(elements.contactModal);
                }
                
                const activeElements = document.querySelectorAll('.interactive-element.active');
                activeElements.forEach(element => {
                    utils.hideElement(element);
                });
                
                // Close phone modal if exists
                const phoneModal = document.querySelector('.phone-action-modal.active');
                if (phoneModal) {
                    phoneModal.classList.remove('active');
                    setTimeout(() => phoneModal.remove(), 300);
                }
            }
        });
    };

    // Form submission handler
    const handleFormSubmission = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(elements.contactForm);
        const data = {
            name: formData.get('name') || document.getElementById('userName').value,
            email: formData.get('email') || document.getElementById('userEmail').value,
            subject: formData.get('subject') || document.getElementById('userSubject').value,
            message: formData.get('message') || document.getElementById('userMessage').value
        };

        // Validate form data
        if (!data.name.trim()) {
            utils.createNotification('Please enter your name', 'error');
            return;
        }

        if (!utils.isValidEmail(data.email)) {
            utils.createNotification('Please enter a valid email address', 'error');
            return;
        }

        if (!data.subject.trim()) {
            utils.createNotification('Please enter a subject', 'error');
            return;
        }

        if (!data.message.trim()) {
            utils.createNotification('Please enter your message', 'error');
            return;
        }

        // Show loading state
        elements.submitBtn.classList.add('loading');
        elements.submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission(data);
            
            utils.createNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            elements.contactForm.reset();
            utils.closeModal(elements.contactModal);
            
        } catch (error) {
            console.error('Form submission error:', error);
            utils.createNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Remove loading state
            elements.submitBtn.classList.remove('loading');
            elements.submitBtn.disabled = false;
        }
    };

    // Simulate form submission (replace with actual API call)
    const simulateFormSubmission = (data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, message: 'Email sent successfully' });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    };

    // Dynamic CSS injection for phone modal and notifications
    const injectDynamicStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Phone Action Modal */
            .phone-action-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                background: var(--bg-primary);
                border-radius: var(--border-radius-xl);
                box-shadow: var(--shadow-2xl);
                padding: 2rem;
                z-index: 3000;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid var(--glass-border);
                min-width: 320px;
                text-align: center;
            }

            .phone-action-modal.active {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }

            .phone-modal-content h3 {
                font-family: var(--font-display);
                font-size: 1.5rem;
                margin-bottom: 1rem;
                background: var(--primary-gradient);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .phone-modal-content p {
                margin-bottom: 1.5rem;
                color: var(--text-secondary);
            }

            .phone-actions {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .action-btn {
                background: var(--primary-gradient);
                color: white;
                border: none;
                padding: 0.875rem 1.5rem;
                border-radius: var(--border-radius-md);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }

            .whatsapp-btn {
                background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
            }

            .copy-btn {
                background: var(--secondary-gradient);
            }

            .close-phone-modal {
                position: absolute;
                top: 0.5rem;
                right: 0.75rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-muted);
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .close-phone-modal:hover {
                background: rgba(220, 38, 38, 0.1);
                color: #dc2626;
            }

            /* Notifications */
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--bg-primary);
                border-radius: var(--border-radius-md);
                box-shadow: var(--shadow-xl);
                border: 1px solid var(--glass-border);
                z-index: 4000;
                opacity: 0;
                transform: translateY(-100%);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 400px;
                min-width: 300px;
            }

            .notification.success {
                border-left: 4px solid #10b981;
            }

            .notification.error {
                border-left: 4px solid #ef4444;
            }

            .notification.info {
                border-left: 4px solid var(--pu-blue);
            }

            .notification-content {
                padding: 1rem 1.25rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .notification-icon {
                flex-shrink: 0;
                font-size: 1.2rem;
            }

            .notification-message {
                flex: 1;
                color: var(--text-primary);
                font-weight: 500;
                line-height: 1.4;
            }

            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 1.25rem;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .notification-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: var(--text-primary);
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .phone-action-modal {
                    width: 90%;
                    min-width: auto;
                    padding: 1.5rem;
                }

                .notification {
                    top: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Initialize everything
    const init = () => {
        injectDynamicStyles();
        setupEventListeners();
        
        // Add loading animation to iframes
        const iframes = [elements.googleFormFrame, elements.mapFrame];
        iframes.forEach(iframe => {
            if (iframe) {
                iframe.addEventListener('load', () => {
                    utils.createNotification('Content loaded successfully!', 'success');
                });
            }
        });

        console.log('Enhanced Contact Section initialized successfully!');
    };

    // Start the initialization
    init();
});
// ========================================= 
// --- ALUMNI MEET SECTION JAVASCRIPT ---
// =========================================
// Add this to your existing script.js file

document.addEventListener('DOMContentLoaded', () => {
    
    // Alumni Meet Configuration
    const ALUMNI_CONFIG = {
        videoUrl: 'https://youtu.be/shmK2peUGQU?si=EJB14g_EXwG9RDZ1',
        images: [
            { src: 'mask.webp', alt: 'Alumni Meet 2024' },
            { src: 'standing.jpeg', alt: 'Group Photo Session' },
            { src: 'Screenshot_20250109-174705 (1).png', alt: 'Award Ceremony' },
            { src: 'cover-alumini.webp', alt: 'Heritage Building' },
            { src: 'Shubham-Jagetia.webp', alt: 'Leadership Team' },
            { src: '26.webp', alt: 'Guest Speaker Session' }
        ]
    };

    // Alumni Meet DOM Elements
    const alumniElements = {
        meetCards: document.querySelectorAll('.alumni-meet-card'),
        meetButtons: document.querySelectorAll('.alumni-meet-btn'),
        closeButtons: document.querySelectorAll('.alumni-close-interactive'),
        
        // Gallery elements
        galleryModal: document.getElementById('alumniGalleryModal'),
        photoGalleryCard: document.getElementById('photoGalleryCard'),
        mainImage: document.getElementById('alumniMainImage'),
        prevBtn: document.getElementById('alumniPrevImage'),
        nextBtn: document.getElementById('alumniNextImage'),
        thumbnails: document.querySelectorAll('.alumni-thumbnail'),
        
        // Video elements
        videoModal: document.getElementById('alumniVideoModal'),
        videoFrame: document.getElementById('alumniVideoFrame'),
        
        // Interactive elements
        interactiveElements: document.querySelectorAll('.alumni-interactive-element')
    };

    // Alumni Meet State
    let alumniState = {
        currentImageIndex: 0,
        isGalleryOpen: false,
        isVideoOpen: false
    };

    // Alumni Utility Functions
    const alumniUtils = {
        showElement(element, callback) {
            if (!element) return;
            element.style.display = 'block';
            requestAnimationFrame(() => {
                element.classList.add('active');
                if (callback) setTimeout(callback, 500);
            });
            setTimeout(() => {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });
            }, 100);
        },

        hideElement(element, callback) {
            if (!element) return;
            element.classList.remove('active');
            setTimeout(() => {
                element.style.display = 'none';
                if (callback) callback();
            }, 500);
        },

        createNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `alumni-notification ${type}`;
            notification.innerHTML = `
                <div class="alumni-notification-content">
                    <span class="alumni-notification-icon">
                        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <span class="alumni-notification-message">${message}</span>
                    <button class="alumni-notification-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-100%)';
                setTimeout(() => notification.remove(), 300);
            }, 4000);
            
            notification.querySelector('.alumni-notification-close').addEventListener('click', () => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-100%)';
                setTimeout(() => notification.remove(), 300);
            });
            
            requestAnimationFrame(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            });
        }
    };

    // Alumni Gallery Functions
    const alumniGallery = {
        init() {
            this.bindEvents();
            this.setupThumbnails();
        },

        bindEvents() {
            if (alumniElements.photoGalleryCard) {
                alumniElements.photoGalleryCard.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openGallery();
                });
            }

            if (alumniElements.prevBtn) {
                alumniElements.prevBtn.addEventListener('click', () => this.previousImage());
            }
            if (alumniElements.nextBtn) {
                alumniElements.nextBtn.addEventListener('click', () => this.nextImage());
            }

            document.addEventListener('keydown', (e) => {
                if (!alumniState.isGalleryOpen) return;
                
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextImage();
                        break;
                    case 'Escape':
                        this.closeGallery();
                        break;
                }
            });
        },

        setupThumbnails() {
            alumniElements.thumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    this.showImage(index);
                });
            });
        },

        openGallery() {
            alumniState.isGalleryOpen = true;
            alumniUtils.showElement(alumniElements.galleryModal);
            this.showImage(0);
            alumniUtils.createNotification('Gallery opened. Use arrow keys to navigate.', 'info');
        },

        closeGallery() {
            alumniState.isGalleryOpen = false;
            alumniUtils.hideElement(alumniElements.galleryModal);
        },

        showImage(index) {
            if (index < 0 || index >= ALUMNI_CONFIG.images.length) return;
            
            alumniState.currentImageIndex = index;
            const imageData = ALUMNI_CONFIG.images[index];
            
            if (alumniElements.mainImage) {
                alumniElements.mainImage.style.opacity = '0';
                setTimeout(() => {
                    alumniElements.mainImage.src = imageData.src;
                    alumniElements.mainImage.alt = imageData.alt;
                    alumniElements.mainImage.style.opacity = '1';
                }, 150);
            }
            
            alumniElements.thumbnails.forEach((thumb, idx) => {
                thumb.classList.toggle('active', idx === index);
            });
        },

        previousImage() {
            const newIndex = alumniState.currentImageIndex > 0 
                ? alumniState.currentImageIndex - 1 
                : ALUMNI_CONFIG.images.length - 1;
            this.showImage(newIndex);
        },

        nextImage() {
            const newIndex = alumniState.currentImageIndex < ALUMNI_CONFIG.images.length - 1 
                ? alumniState.currentImageIndex + 1 
                : 0;
            this.showImage(newIndex);
        }
    };

    // Alumni Video Functions
    const alumniVideo = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-action="video"]');
                if (btn) {
                    e.preventDefault();
                    this.openVideo();
                }
            });
        },

        openVideo() {
            alumniState.isVideoOpen = true;
            
            const embedUrl = this.convertToEmbedUrl(ALUMNI_CONFIG.videoUrl);
            if (alumniElements.videoFrame) {
                alumniElements.videoFrame.src = embedUrl;
            }
            
            alumniUtils.showElement(alumniElements.videoModal);
            alumniUtils.createNotification('Loading video...', 'info');
        },

        closeVideo() {
            alumniState.isVideoOpen = false;
            
            if (alumniElements.videoFrame) {
                alumniElements.videoFrame.src = '';
            }
            
            alumniUtils.hideElement(alumniElements.videoModal);
        },

        convertToEmbedUrl(url) {
            if (url.includes('youtube.com/watch')) {
                const videoId = url.split('v=')[1].split('&')[0];
                return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            } else if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
            return url;
        }
    };

    // Alumni Card Actions
    const alumniCardActions = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            alumniElements.meetButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const action = button.getAttribute('data-action');
                    
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                    
                    this.executeAction(action, button);
                });
            });
        },

        executeAction(action, button) {
            switch (action) {
                case 'gallery':
                    alumniGallery.openGallery();
                    break;
                    
                case 'video':
                    alumniVideo.openVideo();
                    break;
                    
                case 'workshop':
                    this.handleWorkshop(button);
                    break;
                    
                case 'network':
                    this.handleNetworking(button);
                    break;
                    
                case 'stories':
                    this.handleStories(button);
                    break;
                    
                case 'events':
                    this.handleEvents(button);
                    break;
                    
                default:
                    alumniUtils.createNotification(`${action} functionality coming soon!`, 'info');
            }
        },

        handleWorkshop(button) {
            button.classList.add('loading');
            setTimeout(() => {
                button.classList.remove('loading');
                alumniUtils.createNotification('Workshop registration will be available soon!', 'info');
            }, 1000);
        },

        handleNetworking(button) {
            button.classList.add('loading');
            setTimeout(() => {
                button.classList.remove('loading');
                alumniUtils.createNotification('Alumni network platform launching soon!', 'info');
            }, 800);
        },

        handleStories(button) {
            alumniUtils.createNotification('Alumni stories section coming soon!', 'info');
        },

        handleEvents(button) {
            button.classList.add('loading');
            setTimeout(() => {
                button.classList.remove('loading');
                alumniUtils.createNotification('Event calendar coming soon!', 'info');
            }, 1200);
        }
    };

    // Setup Alumni Event Listeners
    const setupAlumniEventListeners = () => {
        alumniElements.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                
                if (targetId === 'alumniGalleryModal') {
                    alumniGallery.closeGallery();
                } else if (targetId === 'alumniVideoModal') {
                    alumniVideo.closeVideo();
                } else {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        alumniUtils.hideElement(targetElement);
                    }
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (alumniState.isGalleryOpen) {
                    alumniGallery.closeGallery();
                } else if (alumniState.isVideoOpen) {
                    alumniVideo.closeVideo();
                }
            }
        });

        alumniElements.meetCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.alumni-meet-btn')) {
                    e.preventDefault();
                }
            });
        });
    };

    // Inject Alumni Dynamic Styles
    const injectAlumniStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .alumni-notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--bg-primary);
                border-radius: var(--border-radius-md);
                box-shadow: var(--shadow-xl);
                border: 1px solid var(--glass-border);
                z-index: 4000;
                opacity: 0;
                transform: translateY(-100%);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 380px;
                min-width: 280px;
            }

            .alumni-notification.success { border-left: 4px solid #10b981; }
            .alumni-notification.error { border-left: 4px solid #ef4444; }
            .alumni-notification.info { border-left: 4px solid var(--pu-blue); }

            .alumni-notification-content {
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .alumni-notification-icon {
                flex-shrink: 0;
                font-size: 1.1rem;
            }

            .alumni-notification-message {
                flex: 1;
                color: var(--text-primary);
                font-weight: 500;
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .alumni-notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 1.2rem;
                cursor: pointer;
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .alumni-notification-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: var(--text-primary);
            }

            @keyframes alumni-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .alumni-meet-btn.loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }

            .alumni-meet-btn.loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 18px;
                height: 18px;
                margin: -9px 0 0 -9px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: alumni-spin 1s linear infinite;
            }

            @media (max-width: 768px) {
                .alumni-notification {
                    top: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Initialize Alumni Meet Section
    const initAlumniMeet = () => {
        try {
            alumniGallery.init();
            alumniVideo.init();
            alumniCardActions.init();
            setupAlumniEventListeners();
            injectAlumniStyles();
            
            console.log('Welcome to Poornima University Alumni Society');
            
            setTimeout(() => {
                alumniUtils.createNotification('Welcome to Poornima University Alumni Society', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('Error initializing Alumni Meet section:', error);
            alumniUtils.createNotification('Some Alumni Meet features may not work properly.', 'error');
        }
    };

    // Start Alumni Meet initialization
    initAlumniMeet();

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && alumniState.isVideoOpen) {
            alumniVideo.closeVideo();
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const whatsappBtn = document.getElementById('join-whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // Replace with your actual WhatsApp group invite link
            const whatsappLink = 'https://chat.whatsapp.com/CyfcfL9rAfz8egq2U3winB?mode=ems_wa_t';
            
            // Opens the link in a new tab
            window.open(whatsappLink, '_blank');
        });
    }
});
