// Image optimization script with caching and mobile optimizations
const imageCache = new Map();
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let connectionType = navigator.connection ? navigator.connection.effectiveType : '4g';

// Connection speed thresholds
const CONNECTION_SPEEDS = {
    'slow-2g': 1,
    '2g': 2,
    '3g': 3,
    '4g': 4
};

document.addEventListener('DOMContentLoaded', function() {
    // Check connection type if available
    if (navigator.connection) {
        connectionType = navigator.connection.effectiveType;
        navigator.connection.addEventListener('change', function() {
            connectionType = navigator.connection.effectiveType;
        });
    }
    
    // Lazy load images with mobile optimizations
    lazyLoadImages();
    
    // Optimize existing images
    optimizeLoadedImages();
});

// Lazy load images
function lazyLoadImages() {
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
        // Mobile-specific configuration
        const mobileConfig = {
            rootMargin: isMobile ? '300px 0px' : '500px 0px', // Smaller buffer on mobile
            threshold: isMobile ? 0.01 : 0.001 // Less sensitive on mobile
        };
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        // Check cache first
                        if (imageCache.has(src)) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        } else {
                            // Create a new image to preload
                            const newImg = new Image();
                            newImg.onload = function() {
                                // Cache the loaded image
                                imageCache.set(src, true);
                                // Update the actual image
                                img.src = src;
                                img.removeAttribute('data-src');
                                img.classList.add('loaded');
                            };
                            
                            // Adjust loading priority based on connection speed
                            if (isMobile && CONNECTION_SPEEDS[connectionType] < 3) {
                                // For slow connections, delay loading slightly to prioritize visible content
                                setTimeout(() => {
                                    newImg.src = src;
                                }, 100);
                            } else {
                                newImg.src = src;
                            }
                        }
                    }
                    
                    // Stop observing after loading
                    imageObserver.unobserve(img);
                }
            });
        }, mobileConfig);
        
        // Target all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        // Prioritize images in viewport on slow connections
        if (isMobile && CONNECTION_SPEEDS[connectionType] < 3) {
            const viewportImages = [];
            const belowFoldImages = [];
            
            lazyImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    viewportImages.push(img);
                } else {
                    belowFoldImages.push(img);
                }
            });
            
            // Load viewport images first
            viewportImages.forEach(img => imageObserver.observe(img));
            // Load below-fold images after a delay
            setTimeout(() => {
                belowFoldImages.forEach(img => imageObserver.observe(img));
            }, 500);
        } else {
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// Optimize loaded images
function optimizeLoadedImages() {
    // Find all images without data-src (already loaded)
    const images = document.querySelectorAll('img:not([data-src])');
    
    images.forEach(img => {
        // Add loading="lazy" attribute for native lazy loading
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding="async" to prevent blocking the main thread
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
        
        // Add fade-in transition when image loads
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        img.onload = () => {
            img.style.opacity = '1';
        };
        
        // Handle case where image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
}