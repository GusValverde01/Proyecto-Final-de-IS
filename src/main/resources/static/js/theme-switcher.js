// Theme switcher logic
document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme-select');
  
  // Apply the saved theme or default to system
  function applyTheme(theme) {
    if (theme === 'system') {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  // Initial theme setup
  const savedTheme = localStorage.getItem('theme') || 'system';
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);

  // Listen for theme changes
  themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeSelect.value === 'system') {
      applyTheme('system');
    }
  });
});