// Dark mode functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const isDarkMode = body.classList.contains('dark-mode');
    body.className = isDarkMode ? 'light-mode' : 'dark-mode';
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
});

// Set initial theme based on user's system preference if no saved preference
if (!savedTheme) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    body.className = prefersDarkScheme.matches ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', prefersDarkScheme.matches ? 'dark' : 'light');

    // Listen for system theme changes
    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            body.className = e.matches ? 'dark-mode' : 'light-mode';
        }
    });
}