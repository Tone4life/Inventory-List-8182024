// Toggle theme between light and dark mode
export function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggleButton = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-mode')) {
        themeToggleButton.textContent = 'Switch to Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleButton.textContent = 'Switch to Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}

// Load user's theme preference on page load
export function loadUserThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = 'Switch to Light Mode';
    }
}
  