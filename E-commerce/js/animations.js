// Initialize animations
function initAnimations() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize GSAP animations if available
    if (typeof gsap !== 'undefined') {
        initGSAPAnimations();
    }
}

// Scroll animations
function initScrollAnimations() {
    // Add animation classes to elements
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        // Section title animations
        const title = section.querySelector('.section-title');
        if (title) {
            title.classList.add('fade-in');
        }
        
        // Product cards animations
        const productCards = section.querySelectorAll('.product-card');
        productCards.forEach((card, cardIndex) => {
            card.classList.add('fade-in');
            card.classList.add(`stagger-${(cardIndex % 5) + 1}`);
        });
        
        // Category cards animations
        const categoryCards = section.querySelectorAll('.category-card');
        categoryCards.forEach((card, cardIndex) => {
            if (cardIndex % 2 === 0) {
                card.classList.add('fade-in-left');
            } else {
                card.classList.add('fade-in-right');
            }
            card.classList.add(`stagger-${(cardIndex % 5) + 1}`);
        });
        
        // Newsletter form animation
        const newsletterForm = section.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.classList.add('fade-in');
        }
    });
    
    // Check elements visibility on scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
}

// Check if elements are visible in viewport
function checkVisibility() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
        
        if (isVisible) {
            element.classList.add('active');
        }
    });
}

// GSAP animations
function initGSAPAnimations() {
    // Register ScrollTrigger plugin
    if (gsap.registerPlugin && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section animations
        gsap.from('.hero-content h1', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-content p', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-buttons', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.6,
            ease: 'power3.out'
        });
        
        // Floating image animation
        gsap.to('.floating-image', {
            y: -30,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
        
        // Section titles animation
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            });
        });
        
        // Product cards animation
        gsap.utils.toArray('.product-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
        
        // Banner parallax effect
        gsap.to('.parallax-section', {
            scrollTrigger: {
                trigger: '.parallax-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            backgroundPosition: '50% 100%',
            ease: 'none'
        });
    }
}

// Button hover effect
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', (e) => {
        const x = e.clientX - button.getBoundingClientRect().left;
        const y = e.clientY - button.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Product image hover effect
const productImages = document.querySelectorAll('.product-image');
productImages.forEach(image => {
    image.addEventListener('mouseenter', () => {
        const img = image.querySelector('img');
        gsap.to(img, {
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
    
    image.addEventListener('mouseleave', () => {
        const img = image.querySelector('img');
        gsap.to(img, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});