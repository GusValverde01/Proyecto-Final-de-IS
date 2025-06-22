// Animación de entrada para el panel de éxito
document.addEventListener('DOMContentLoaded', function() {
    // Animación de entrada del panel
    const successPanel = document.querySelector('.success-panel');
    if (successPanel) {
        successPanel.style.opacity = '0';
        successPanel.style.transform = 'translateY(30px)';
        successPanel.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            successPanel.style.opacity = '1';
            successPanel.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Animación de entrada de los beneficios
    const benefitItems = document.querySelectorAll('.success-benefits li');
    benefitItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 800 + (index * 200));
    });
    
    // Efecto de hover mejorado para los botones
    const buttons = document.querySelectorAll('.btn-login, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Agregar efecto de pulso al ícono de éxito
    const successIcon = document.querySelector('.success-icon');
    if (successIcon) {
        setInterval(() => {
            successIcon.style.transform = 'scale(1.1)';
            setTimeout(() => {
                successIcon.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
    
    // Auto-redirect después de un tiempo (opcional)
    let countdown = 30;
    const createCountdownElement = () => {
        const countdownElement = document.createElement('div');
        countdownElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        countdownElement.innerHTML = `Auto-redirect en ${countdown}s <button onclick="clearAutoRedirect()" style="background:none;border:none;color:white;cursor:pointer;margin-left:8px;">✕</button>`;
        document.body.appendChild(countdownElement);
        return countdownElement;
    };
    
    // Función global para cancelar auto-redirect
    window.clearAutoRedirect = function() {
        if (window.autoRedirectInterval) {
            clearInterval(window.autoRedirectInterval);
        }
        const countdownElement = document.querySelector('[style*="position: fixed"]');
        if (countdownElement) {
            countdownElement.remove();
        }
    };
    
    // Iniciar countdown después de 10 segundos
    setTimeout(() => {
        const countdownElement = createCountdownElement();
        
        window.autoRedirectInterval = setInterval(() => {
            countdown--;
            countdownElement.innerHTML = `Auto-redirect en ${countdown}s <button onclick="clearAutoRedirect()" style="background:none;border:none;color:white;cursor:pointer;margin-left:8px;">✕</button>`;
            
            if (countdown <= 0) {
                window.location.href = '/login';
            }
        }, 1000);
    }, 10000);
});

// Función para crear partículas adicionales de celebración
function createCelebrationParticles() {
    const container = document.querySelector('.success-animation');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: hsl(${Math.random() * 360}, 70%, 60%);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 200 - 100}px;
            top: ${Math.random() * 200 - 100}px;
            animation: particleFloat ${2 + Math.random() * 2}s ease-out forwards;
        `;
        
        container.appendChild(particle);
        
        // Remover partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }
}

// Crear partículas de celebración después de 1 segundo
setTimeout(createCelebrationParticles, 1000);

// Agregar estilos para la animación de partículas
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);