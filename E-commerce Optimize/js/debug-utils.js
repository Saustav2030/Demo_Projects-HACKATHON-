// Debug utilities to help identify JavaScript errors

// Initialize error tracking
function initErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', function(event) {
        console.error('JavaScript Error:', {
            message: event.message,
            source: event.filename,
            lineNumber: event.lineno,
            columnNumber: event.colno,
            error: event.error
        });
        
        // You could send these errors to a server for logging
        // sendErrorToServer(event);
        
        return false;
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        return false;
    });
    
    // Track performance issues
    if ('PerformanceObserver' in window) {
        try {
            // Track long tasks (tasks that take more than 50ms)
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.warn('Long Task Detected:', {
                        duration: entry.duration,
                        startTime: entry.startTime,
                        name: entry.name
                    });
                });
            });
            
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            
            // Track layout shifts
            const layoutShiftObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.value > 0.1) { // Only log significant shifts
                        console.warn('Layout Shift Detected:', {
                            value: entry.value,
                            sources: entry.sources
                        });
                    }
                });
            });
            
            if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
                layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
            }
        } catch (e) {
            console.error('Performance observer error:', e);
        }
    }
}

// Check for render-blocking resources
function checkRenderBlockingResources() {
    if (window.performance && window.performance.getEntriesByType) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const resources = window.performance.getEntriesByType('resource');
                const blockingResources = resources.filter(resource => {
                    return resource.initiatorType === 'script' || 
                           resource.initiatorType === 'css' || 
                           resource.initiatorType === 'link';
                }).sort((a, b) => b.duration - a.duration);
                
                console.log('Potential render-blocking resources:', blockingResources.slice(0, 5));
            }, 1000);
        });
    }
}

// Initialize debug utilities
document.addEventListener('DOMContentLoaded', function() {
    initErrorTracking();
    checkRenderBlockingResources();
});