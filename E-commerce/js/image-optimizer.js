// Image optimization script
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    lazyLoadImages();
    
    // Optimize existing images
    optimizeLoadedImages();
});

// Lazy load images
function lazyLoadImages() {
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        // Create a new image to preload
                        const newImg = new Image();
                        newImg.onload = function() {
                            // Once loaded, update the actual image
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        };
                        newImg.src = src;
                    }
                    
                    // Stop observing after loading
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px', // Start loading when image is 200px from viewport
            threshold: 0.01
        });
        
        // Target all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
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
    });
}