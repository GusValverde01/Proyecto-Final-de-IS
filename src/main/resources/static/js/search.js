document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const searchForm = document.getElementById('searchForm');
    const queryInput = document.getElementById('query');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const typeOptions = document.querySelectorAll('input[name="type"]');
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselIndicators = document.getElementById('carouselIndicators');
    
    // Variables del carrusel
    let currentSlide = 0;
    let slidesToShow = calculateSlidesToShow();
    let totalSlides = 0;
    
    // Inicializar
    setupEventListeners();
    setupCarousel();
    setupQuickSearches();
    setupSearchSuggestions();
    
    // Configurar event listeners
    function setupEventListeners() {
        // Formulario de búsqueda
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearch);
        }
        
        // Botón limpiar
        if (clearBtn) {
            clearBtn.addEventListener('click', clearForm);
        }
        
        // Input de búsqueda
        if (queryInput) {
            queryInput.addEventListener('input', handleInputChange);
            queryInput.addEventListener('keydown', handleKeyDown);
            queryInput.addEventListener('focus', showSuggestions);
            queryInput.addEventListener('blur', hideSuggestions);
        }
        
        // Opciones de tipo
        typeOptions.forEach(option => {
            option.addEventListener('change', handleTypeChange);
        });
        
        // Carrusel
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Redimensionar ventana
        window.addEventListener('resize', handleResize);
    }
    
    // Manejar envío del formulario
    function handleSearch(e) {
        const query = queryInput.value.trim();
        
        if (!query) {
            e.preventDefault();
            showToast('Por favor ingresa un término de búsqueda', 'warning');
            queryInput.focus();
            return;
        }
        
        // Mostrar loader
        showLoader();
        
        // El formulario se envía normalmente
        // El loader se ocultará cuando la página se recargue
    }
    
    // Mostrar/ocultar loader del botón
    function showLoader() {
        const btnText = searchBtn.querySelector('.btn-text');
        const btnLoader = searchBtn.querySelector('.btn-loader');
        const searchIcon = searchBtn.querySelector('.search-icon');
        
        if (btnText) btnText.style.display = 'none';
        if (searchIcon) searchIcon.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'flex';
        searchBtn.disabled = true;
    }
    
    function hideLoader() {
        const btnText = searchBtn.querySelector('.btn-text');
        const btnLoader = searchBtn.querySelector('.btn-loader');
        const searchIcon = searchBtn.querySelector('.search-icon');
        
        if (btnText) btnText.style.display = 'inline';
        if (searchIcon) searchIcon.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
        searchBtn.disabled = false;
    }
    
    // Limpiar formulario
    function clearForm() {
        queryInput.value = '';
        document.getElementById('type-libro').checked = true;
        queryInput.focus();
        hideSuggestions();
        showToast('Formulario limpiado', 'info');
    }
    
    // Manejar cambios en el input
    function handleInputChange() {
        const value = queryInput.value.trim();
        
        if (value.length > 0) {
            updateSuggestions(value);
        } else {
            hideSuggestions();
        }
    }
    
    // Manejar teclas especiales
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            hideSuggestions();
        }
    }
    
    // Manejar cambio de tipo
    function handleTypeChange(e) {
        const selectedType = e.target.value;
        const typeOption = e.target.closest('.type-option');
        
        // Animación visual
        typeOption.style.transform = 'scale(0.95)';
        setTimeout(() => {
            typeOption.style.transform = 'scale(1)';
        }, 150);
        
        showToast(`Tipo seleccionado: ${getTypeName(selectedType)}`, 'info');
    }
    
    // Obtener nombre del tipo
    function getTypeName(type) {
        const typeNames = {
            'libro': 'Libros',
            'serie': 'Series',
            'videojuego': 'Videojuegos',
            'anime': 'Anime',
            'all': 'Todo'
        };
        return typeNames[type] || type;
    }
    
    // Configurar carrusel
    function setupCarousel() {
        if (!carouselTrack) return;
        
        const cards = carouselTrack.querySelectorAll('.recommendation-card');
        totalSlides = Math.ceil(cards.length / slidesToShow);
        
        if (totalSlides <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }
        
        // Configurar indicadores
        setupIndicators();
        
        // Configurar event listeners para las tarjetas
        cards.forEach((card, index) => {
            // Click en la tarjeta
            card.addEventListener('click', function() {
                const busqueda = this.dataset.busqueda;
                if (busqueda) {
                    queryInput.value = busqueda;
                    showToast(`Búsqueda seleccionada: ${busqueda}`, 'info');
                }
            });
            
            // Botón de búsqueda rápida
            const quickSearchBtn = card.querySelector('.quick-search-btn');
            if (quickSearchBtn) {
                quickSearchBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const query = this.dataset.query;
                    if (query) {
                        performQuickSearch(query);
                    }
                });
            }
        });
        
        updateCarousel();
    }
    
    // Calcular slides a mostrar
    function calculateSlidesToShow() {
        const width = window.innerWidth;
        if (width >= 1024) return 3;
        if (width >= 768) return 2;
        return 1;
    }
    
    // Configurar indicadores
    function setupIndicators() {
        if (!carouselIndicators || totalSlides <= 1) return;
        
        carouselIndicators.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                currentSlide = i;
                updateCarousel();
                updateIndicators();
            });
            
            carouselIndicators.appendChild(indicator);
        }
    }
    
    // Slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        updateIndicators();
    }
    
    // Slide siguiente
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        updateIndicators();
    }
    
    // Actualizar carrusel
    function updateCarousel() {
        if (!carouselTrack) return;
        
        const cardWidth = 200 + 16; // card width + gap
        const offset = -currentSlide * cardWidth * slidesToShow;
        carouselTrack.style.transform = `translateX(${offset}px)`;
    }
    
    // Actualizar indicadores
    function updateIndicators() {
        const indicators = carouselIndicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Manejar redimensionamiento
    function handleResize() {
        const newSlidesToShow = calculateSlidesToShow();
        if (newSlidesToShow !== slidesToShow) {
            slidesToShow = newSlidesToShow;
            const cards = carouselTrack.querySelectorAll('.recommendation-card');
            totalSlides = Math.ceil(cards.length / slidesToShow);
            currentSlide = Math.min(currentSlide, totalSlides - 1);
            setupIndicators();
            updateCarousel();
        }
    }
    
    // Configurar búsquedas rápidas
    function setupQuickSearches() {
        const tagBtns = document.querySelectorAll('.tag-btn');
        
        tagBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const query = this.dataset.query;
                const type = this.dataset.type;
                
                if (query) {
                    queryInput.value = query;
                    
                    if (type) {
                        const typeInput = document.getElementById(`type-${type}`);
                        if (typeInput) {
                            typeInput.checked = true;
                        }
                    }
                    
                    // Animación del botón
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                    
                    showToast(`Búsqueda configurada: ${query}`, 'success');
                    
                    // Auto-scroll al formulario
                    document.querySelector('.search-form-section').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });
    }
    
    // Configurar sugerencias de búsqueda
    function setupSearchSuggestions() {
        // Crear elemento de sugerencias si no existe
        let suggestions = document.getElementById('suggestions');
        if (!suggestions) {
            suggestions = document.createElement('div');
            suggestions.id = 'suggestions';
            suggestions.className = 'input-suggestions';
            queryInput.parentNode.appendChild(suggestions);
        }
    }
    
    // Actualizar sugerencias
    function updateSuggestions(query) {
        const suggestions = document.getElementById('suggestions');
        if (!suggestions) return;
        
        // Sugerencias predefinidas (puedes conectar con una API)
        const predefinedSuggestions = [
            'Harry Potter', 'Game of Thrones', 'Naruto', 'Minecraft',
            'Breaking Bad', 'The Witcher', 'One Piece', 'Zelda',
            'Stephen King', 'Marvel', 'Dragon Ball', 'Pokemon'
        ];
        
        const filtered = predefinedSuggestions.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        
        if (filtered.length > 0) {
            suggestions.innerHTML = filtered.map(item =>
                `<div class="suggestion-item" data-value="${item}">${item}</div>`
            ).join('');
            
            // Event listeners para sugerencias
            suggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    queryInput.value = this.dataset.value;
                    hideSuggestions();
                    queryInput.focus();
                });
            });
            
            suggestions.style.display = 'block';
        } else {
            hideSuggestions();
        }
    }
    
    // Mostrar sugerencias
    function showSuggestions() {
        const suggestions = document.getElementById('suggestions');
        const value = queryInput.value.trim();
        
        if (value && suggestions && suggestions.children.length > 0) {
            suggestions.style.display = 'block';
        }
    }
    
    // Ocultar sugerencias
    function hideSuggestions() {
        setTimeout(() => {
            const suggestions = document.getElementById('suggestions');
            if (suggestions) {
                suggestions.style.display = 'none';
            }
        }, 200);
    }
    
    // Realizar búsqueda rápida
    function performQuickSearch(query) {
        queryInput.value = query;
        
        // Mostrar loader y enviar formulario
        showLoader();
        
        setTimeout(() => {
            searchForm.submit();
        }, 500);
    }
    
    // Sistema de toast
    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const styles = {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            transform: 'translateY(100px)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        };
        
        const typeStyles = {
            info: { background: '#3b82f6' },
            success: { background: '#22c55e' },
            error: { background: '#ef4444' },
            warning: { background: '#f59e0b' }
        };
        
        Object.assign(toast.style, styles, typeStyles[type]);
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Auto-focus en el input al cargar
    if (queryInput) {
        queryInput.focus();
    }
});