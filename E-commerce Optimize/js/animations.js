// Initialize animations
function initAnimations() {
    // Check if device is low-end before initializing animations
    if (isLowEndDevice()) {
        // Apply minimal animations for low-end devices
        applyMinimalAnimations();
        return;
    }
    
    // Initialize scroll animations with a slight delay to prioritize initial page load
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
    
    // Initialize GSAP animations if available
    if (typeof gsap !== 'undefined') {
        // Use requestAnimationFrame to ensure animations start at the right time
        requestAnimationFrame(() => {
            initGSAPAnimations();
        });
    }
}

// Detect low-end devices based on memory and processor
function isLowEndDevice() {
    // Check for low memory (if available in the browser)
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        return true;
    }
    
    // Check for slow CPU (if available)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return true;
    }
    
    // Check for mobile devices which are typically less powerful
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    
    return false;
}

// Apply minimal animations for low-end devices
function applyMinimalAnimations() {
    // Only animate the hero section
    const heroTl = gsap.timeline({
        defaults: {
            ease: 'power2.out',
            duration: 0.6
        }
    });
    
    heroTl
        .from('.hero-content h1', {
            y: 20,
            opacity: 0,
            force3D: true
        })
        .from('.hero-content p', {
            opacity: 0
        }, '-=0.3')
        .from('.hero-buttons', {
            opacity: 0
        }, '-=0.3');
    
    // Make all other elements visible immediately
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        el.classList.add('active');
    });
}

// Scroll animations with optimizations
function initScrollAnimations() {
    // Add animation classes to elements
    const sections = document.querySelectorAll('section');
    
    // Use IntersectionObserver instead of scroll event for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    entry.target.classList.add('active');
                });
                // Unobserve after animation is triggered to save resources
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Process sections in batches to avoid layout thrashing
    const processBatch = (elements, startIndex, batchSize) => {
        const endIndex = Math.min(startIndex + batchSize, elements.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const section = elements[i];
            
            // Section title animations - only animate titles
            const title = section.querySelector('.section-title');
            if (title) {
                title.classList.add('fade-in');
                observer.observe(title);
            }
            
            // REDUCED: Only animate first 3 product cards per section
            const productCards = Array.from(section.querySelectorAll('.product-card')).slice(0, 3);
            productCards.forEach((card, cardIndex) => {
                card.classList.add('fade-in');
                observer.observe(card);
            });
            
            // Make all other product cards visible immediately
            const remainingCards = Array.from(section.querySelectorAll('.product-card')).slice(3);
            remainingCards.forEach(card => {
                card.classList.add('active');
            });
            
            // REDUCED: Only animate first 2 category cards
            const categoryCards = Array.from(section.querySelectorAll('.category-card')).slice(0, 2);
            categoryCards.forEach((card, cardIndex) => {
                card.classList.add('fade-in');
                observer.observe(card);
            });
            
            // Make all other category cards visible immediately
            const remainingCategoryCards = Array.from(section.querySelectorAll('.category-card')).slice(2);
            remainingCategoryCards.forEach(card => {
                card.classList.add('active');
            });
            
            // Newsletter form animation
            const newsletterForm = section.querySelector('.newsletter-form');
            if (newsletterForm) {
                newsletterForm.classList.add('fade-in');
                observer.observe(newsletterForm);
            }
        }
        
        // Process next batch if needed
        if (endIndex < elements.length) {
            setTimeout(() => {
                processBatch(elements, endIndex, batchSize);
            }, 16); // Roughly one frame at 60fps
        }
    };
    
    // Start processing in batches of 2 sections at a time
    processBatch(Array.from(sections), 0, 2);
}

// GSAP animations with performance optimizations
function initGSAPAnimations() {
    // Register ScrollTrigger plugin
    if (gsap.registerPlugin && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Reduce animation complexity
        const heroTl = gsap.timeline({
            defaults: {
                ease: 'power2.out',
                duration: 0.8,
                clearProps: 'transform' // Clear transform after animation completes
            }
        });
        
        heroTl
            .from('.hero-content h1', {
                y: 30,
                opacity: 0,
                force3D: true
            })
            .from('.hero-content p', {
                y: 20,
                opacity: 0,
                force3D: true
            }, '-=0.5')
            .from('.hero-buttons', {
                y: 20,
                opacity: 0,
                force3D: true
            }, '-=0.5');
        
        // Simplify floating image animation
        gsap.to('.floating-image', {
            y: -15, // REDUCED movement
            duration: 3, // INCREASED duration for smoother animation
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            force3D: true
        });
        
        // REDUCED: Only animate section titles
        ScrollTrigger.batch('.section-title', {
            start: 'top 85%',
            onEnter: batch => {
                gsap.from(batch, {
                    duration: 0.6,
                    y: 20, // REDUCED movement
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power2.out',
                    force3D: true,
                    clearProps: 'transform'
                });
            },
            once: true
        });
        
        // REMOVED: Parallax effect completely
        // Parallax effects are very expensive for performance
    }
}

// Optimize button hover effect with debounce
const buttons = document.querySelectorAll('.btn');
let isButtonAnimating = false;

buttons.forEach(button => {
    button.addEventListener('mouseenter', (e) => {
        if (isButtonAnimating) return;
        isButtonAnimating = true;
        
        const x = e.clientX - button.getBoundingClientRect().left;
        const y = e.clientY - button.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
            isButtonAnimating = false;
        }, 600);
    });
});

// Optimize product image hover effect
const productImages = document.querySelectorAll('.product-image');
productImages.forEach(image => {
    // Use a flag to prevent multiple animations
    let isAnimating = false;
    
    image.addEventListener('mouseenter', () => {
        if (isAnimating || window.innerWidth <= 768) return;
        isAnimating = true;
        
        const img = image.querySelector('img');
        gsap.to(img, {
            scale: 1.05, // Reduced scale for better performance
            duration: 0.4,
            ease: 'power1.out',
            onComplete: () => {
                isAnimating = false;
            }
        });
    });
    
    image.addEventListener('mouseleave', () => {
        if (window.innerWidth <= 768) return;
        
        const img = image.querySelector('img');
        gsap.to(img, {
            scale: 1,
            duration: 0.4,
            ease: 'power1.out'
        });
    });
});

// Optimize smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Use native scrollIntoView for better performance
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add a resize handler with debounce to adjust animations on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(() => {
        // Reinitialize animations with appropriate settings for current screen size
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250);
});

// Disable animations completely if the user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Remove all animations
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => {
        el.classList.add('active');
        el.style.transition = 'none';
    });
    
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf('*');
    }
}