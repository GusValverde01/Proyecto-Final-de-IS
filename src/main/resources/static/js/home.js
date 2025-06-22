document.addEventListener('DOMContentLoaded', function() {
    // Actualizar tiempo y saludo
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 1000);
    
    // Animar estadísticas
    animateStats();
    
    // Animar elementos flotantes
    initFloatingElements();
    
    // Cargar datos del usuario (simulado)
    loadUserData();
});

function updateTimeAndGreeting() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    const greetingElement = document.getElementById('timeGreeting');
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    if (greetingElement) {
        const hour = now.getHours();
        let greeting;
        
        if (hour < 12) {
            greeting = "Buenos días";
        } else if (hour < 18) {
            greeting = "Buenas tardes";
        } else {
            greeting = "Buenas noches";
        }
        
        greetingElement.textContent = greeting;
    }
}

function animateStats() {
    const statElements = document.querySelectorAll('.stat-info h3');
    
    statElements.forEach((element, index) => {
        const finalValue = parseInt(element.textContent);
        element.textContent = '0';
        
        setTimeout(() => {
            animateNumber(element, 0, finalValue, 1000);
        }, index * 200);
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach(element => {
        element.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            showCategoryInfo(type);
        });
        
        // Añadir animación de entrada
        element.style.opacity = '0';
        element.style.transform = 'scale(0)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, Math.random() * 1000);
    });
}

function showCategoryInfo(type) {
    const categories = {
        anime: { name: 'Anime', description: 'Descubre el mundo del anime japonés' },
        games: { name: 'Videojuegos', description: 'Explora los mejores videojuegos' },
        books: { name: 'Libros', description: 'Sumérgete en grandes historias' },
        series: { name: 'Series', description: 'Las mejores series de TV' },
        movies: { name: 'Películas', description: 'Cinema para todos los gustos' },
        music: { name: 'Música', description: 'Descubre nuevos sonidos' }
    };
    
    const category = categories[type];
    if (category) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `
            <h4 style="margin: 0 0 5px 0;">${category.name}</h4>
            <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${category.description}</p>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

function loadUserData() {
    // Simular carga de datos del usuario
    setTimeout(() => {
        updateUserStats({
            totalSearches: Math.floor(Math.random() * 50) + 10,
            totalFavorites: Math.floor(Math.random() * 20) + 5,
            categoriesExplored: Math.floor(Math.random() * 6) + 2
        });
    }, 1000);
}

function updateUserStats(data) {
    const searchesElement = document.getElementById('totalSearches');
    const favoritesElement = document.getElementById('totalFavorites');
    const categoriesElement = document.getElementById('categoriesExplored');
    
    if (searchesElement) {
        animateNumber(searchesElement, parseInt(searchesElement.textContent), data.totalSearches, 800);
    }
    
    if (favoritesElement) {
        animateNumber(favoritesElement, parseInt(favoritesElement.textContent), data.totalFavorites, 800);
    }
    
    if (categoriesElement) {
        animateNumber(categoriesElement, parseInt(categoriesElement.textContent), data.categoriesExplored, 800);
    }
}

// Efectos adicionales para las tarjetas de acción
document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Animación de entrada para los elementos de actividad
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('.activity-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `all 0.5s ease ${index * 0.1}s`;
    observer.observe(item);
});