document.addEventListener('DOMContentLoaded', function() {
  // Obtener tema guardado o usar "system" por defecto
  const savedTheme = localStorage.getItem('theme') || 'system';
  setTheme(savedTheme);
  
  // Manejar clics en las opciones de tema
  document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', function() {
          const theme = this.getAttribute('data-theme');
          setTheme(theme);
          localStorage.setItem('theme', theme);
      });
  });
  
  // Toggle del botón principal (opcional, para mostrar/ocultar dropdown)
  document.getElementById('theme-toggle').addEventListener('click', function() {
      const dropdown = document.querySelector('.theme-dropdown');
      dropdown.style.opacity = dropdown.style.opacity === '1' ? '0' : '1';
      dropdown.style.visibility = dropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
      dropdown.style.transform = dropdown.style.transform === 'translateY(0px)' ? 'translateY(-10px)' : 'translateY(0px)';
      
      // Auto-ocultar después de 3 segundos
      if (dropdown.style.opacity === '1') {
          setTimeout(() => {
              dropdown.style.opacity = '0';
              dropdown.style.visibility = 'hidden';
              dropdown.style.transform = 'translateY(-10px)';
          }, 3000);
      }
  });
  
  // Función para establecer el tema
  function setTheme(theme) {
      if (theme === 'system') {
          // Detectar preferencia del sistema
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', theme);
          document.documentElement.classList.toggle('dark-mode', prefersDark);
      } else {
          document.documentElement.setAttribute('data-theme', theme);
          document.documentElement.classList.toggle('dark-mode', theme === 'dark');
      }
  }
  
  // Escuchar cambios en las preferencias del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('theme') === 'system') {
          document.documentElement.classList.toggle('dark-mode', e.matches);
      }
  });
});