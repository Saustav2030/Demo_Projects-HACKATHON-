// DOM Elements
const loader = document.querySelector('.loader');
const themeToggle = document.querySelector('.theme-toggle');
const hamburger = document.querySelector('.hamburger');
const header = document.querySelector('header');
const sliderContainer = document.querySelector('.trending-slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const productCards = document.querySelectorAll('.product-card');

// Page Load
window.addEventListener('load', () => {
    // Hide loader after page load
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        document.body.style.overflow = 'visible';
    }, 1500);
    
    // Initialize animations
    initAnimations();
    
    // Initialize 3D tilt effect
    initTilt();
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save theme preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
    document.body.classList.add('dark-mode');
}

// Mobile Menu
hamburger.addEventListener('click', () => {
    // Check if mobile menu exists, if not create it
    let mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        const mobileNav = document.createElement('ul');
        mobileNav.className = 'mobile-nav-links';
        
        // Clone nav links
        const navLinks = document.querySelector('.nav-links').cloneNode(true);
        const navItems = navLinks.querySelectorAll('li');
        
        navItems.forEach(item => {
            const link = item.querySelector('a');
            const mobileItem = document.createElement('li');
            const mobileLink = document.createElement('a');
            
            mobileLink.href = link.href;
            mobileLink.textContent = link.textContent;
            mobileLink.className = 'mobile-nav-link';
            
            mobileItem.appendChild(mobileLink);
            mobileNav.appendChild(mobileItem);
        });
        
        mobileMenu.appendChild(closeBtn);
        mobileMenu.appendChild(mobileNav);
        document.body.appendChild(mobileMenu);
        
        // Close menu when clicking on close button
        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // Toggle mobile menu
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Header scroll effect
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class
    if (scrollTop > 50) {
        header.classList.add('navbar-scrolled');
    } else {
        header.classList.remove('navbar-scrolled');
    }
    
    // Hide/show header on scroll
    if (scrollTop > lastScrollTop && scrollTop > 300) {
        header.classList.add('navbar-hidden');
    } else {
        header.classList.remove('navbar-hidden');
    }
    
    lastScrollTop = scrollTop;
});

// Trending Slider
let slideIndex = 0;
const slideWidth = 300 + 32; // Card width + margin

// Next button
nextBtn.addEventListener('click', () => {
    slideIndex++;
    const slides = document.querySelectorAll('.trending-slide');
    
    if (slideIndex >= slides.length - 2) {
        slideIndex = slides.length - 2;
    }
    
    sliderContainer.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
});

// Previous button
prevBtn.addEventListener('click', () => {
    slideIndex--;
    
    if (slideIndex < 0) {
        slideIndex = 0;
    }
    
    sliderContainer.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
});

// Initialize 3D tilt effect
function initTilt() {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3
        });
    }
}

// Form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        if (emailInput.value) {
            // Show success message
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Thank you for subscribing!';
            successMessage.style.color = 'var(--primary-color)';
            successMessage.style.marginTop = '1rem';
            
            // Replace form with success message
            newsletterForm.innerHTML = '';
            newsletterForm.appendChild(successMessage);
        }
    });
}

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get product info
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Change button text temporarily
        const originalText = button.textContent;
        button.textContent = 'Added to Cart!';
        button.style.backgroundColor = '#2ecc71';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
        
        // You would typically send this to a cart system
        console.log(`Added ${productName} to cart`);
    });
});