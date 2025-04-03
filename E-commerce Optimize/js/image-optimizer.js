// Image optimization script with caching and mobile optimizations
const imageCache = new Map();
let connectionType = navigator.connection ? navigator.connection.effectiveType : '4g';

// Connection speed thresholds
const CONNECTION_SPEEDS = {
    'slow-2g': 1,
    '2g': 2,
    '3g': 3,
    '4g': 4
};

// Mobile configuration for IntersectionObserver
const mobileConfig = {
    rootMargin: '300px 0px',
    threshold: 0.01
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
function getOptimizedImageSrc(originalSrc) {
    // Apply quality settings to ensure images don't exceed 150KB
    // For slow connections (2g/3g) use very low quality, for fast connections (4g) use low quality
    const quality = CONNECTION_SPEEDS[connectionType] < 3 ? '3' : '15';
    
    // Check for WebP support
    const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    // Get base URL without existing query params
    const baseUrl = originalSrc.split('?')[0];
    
    // Return optimized URL with appropriate format and quality
    // Added strict size enforcement and additional compression parameters
    if (supportsWebP) {
        return `${baseUrl}?format=webp&quality=${quality}&width=800&compress=high&max_size=150&strip=all&optimize=medium`;
    }
    return `${baseUrl}?quality=${quality}&width=800&compress=high&max_size=150&strip=all&optimize=medium`;
}

function lazyLoadImages() {
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
        // Universal configuration
        const config = {
            rootMargin: '500px 0px',
            threshold: 0.001
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
                                // Update the actual image with optimized version
                                const optimizedSrc = getOptimizedImageSrc(src);
                                img.src = optimizedSrc;
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
        if (CONNECTION_SPEEDS[connectionType] < 3) {
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
    
    // Check for WebP support once
    const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    images.forEach(img => {
        // Add responsive srcset if not present
        if (!img.hasAttribute('srcset') && img.src) {
            const src = img.src.split('?')[0];
            const srcset = supportsWebP 
                ? `${src}?format=webp&quality=20 300w, ${src}?format=webp&quality=30 600w, ${src}?format=webp&quality=40 1200w`
                : `${src}?quality=20 300w, ${src}?quality=30 600w, ${src}?quality=40 1200w`;
            img.setAttribute('srcset', srcset);
            img.setAttribute('sizes', '(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px');
        }
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