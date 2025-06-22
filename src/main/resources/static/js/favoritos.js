document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const searchFilter = document.getElementById('searchFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const clearAllButton = document.getElementById('clearAllFavorites');
    const totalFavoritosElement = document.getElementById('totalFavoritos');
    const categoriasElement = document.getElementById('categorias');
    
    // Inicializar
    calculateStatistics();
    setupEventListeners();
    setupSectionToggles();
    
    // Configurar event listeners
    function setupEventListeners() {
        // Filtro de búsqueda
        if (searchFilter) {
            searchFilter.addEventListener('input', filterFavorites);
        }
        
        // Filtro por categoría
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterByCategory);
        }
        
        // Limpiar todos los favoritos
        if (clearAllButton) {
            clearAllButton.addEventListener('click', confirmClearAllFavorites);
        }
        
        // Botones de eliminar favorito individual (usando la clase correcta)
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const card = this.closest('.favorito-card');
                const title = card.dataset.title;
                const id = this.getAttribute('onclick')?.match(/\d+/)?.[0]; // Extraer ID del onclick
                
                if (id) {
                    confirmRemoveFavorite(card, title, 'item', id);
                }
            });
        });
        
        // Botones de ver detalles (usando la clase correcta)
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const card = this.closest('.favorito-card');
                showDetails(card);
            });
        });
        
        // Click en cards para mostrar detalles
        document.querySelectorAll('.favorito-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // Solo si no se hizo click en un botón
                if (!e.target.closest('button')) {
                    showDetails(this);
                }
            });
        });
    }
    
    // Configurar toggles de secciones
    function setupSectionToggles() {
        document.querySelectorAll('.section-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.dataset.target;
                const target = document.getElementById(targetId);
                const isExpanded = !target.classList.contains('collapsed');
                
                if (isExpanded) {
                    target.classList.add('collapsed');
                    this.classList.add('rotated');
                } else {
                    target.classList.remove('collapsed');
                    this.classList.remove('rotated');
                }
            });
        });
    }
    
    // Calcular estadísticas
    function calculateStatistics() {
        const allCards = document.querySelectorAll('.favorito-card');
        const sections = document.querySelectorAll('.favoritos-section[data-category]');
        
        // Total de favoritos
        if (totalFavoritosElement) {
            totalFavoritosElement.textContent = allCards.length;
        }
        
        // Número de categorías con contenido
        if (categoriasElement) {
            categoriasElement.textContent = sections.length;
        }
    }
    
    // Filtrar favoritos por texto
    function filterFavorites() {
        const filterValue = searchFilter.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.favorito-card');
        let visibleCount = 0;
        
        allCards.forEach(card => {
            const title = card.dataset.title.toLowerCase();
            const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
            const author = card.querySelector('.card-author')?.textContent.toLowerCase() || '';
            
            const matchesSearch = title.includes(filterValue) || 
                                description.includes(filterValue) || 
                                author.includes(filterValue);
            
            if (matchesSearch) {
                card.classList.remove('hidden');
                card.style.display = '';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar secciones según contenido visible
        updateSectionVisibility();
        
        // Mostrar mensaje de "sin resultados"
        showNoResultsMessage(visibleCount === 0 && filterValue !== '');
    }
    
    // Filtrar por categoría
    function filterByCategory() {
        const selectedCategory = categoryFilter.value;
        const sections = document.querySelectorAll('.favoritos-section');
        
        sections.forEach(section => {
            const sectionCategory = section.dataset.category;
            
            if (selectedCategory === 'all' || selectedCategory === sectionCategory) {
                section.style.display = '';
                section.classList.remove('hidden');
            } else {
                section.style.display = 'none';
                section.classList.add('hidden');
            }
        });
        
        // Limpiar filtro de búsqueda si existe
        if (searchFilter && searchFilter.value) {
            searchFilter.value = '';
            // Re-mostrar todas las tarjetas de las secciones visibles
            document.querySelectorAll('.favorito-card').forEach(card => {
                card.classList.remove('hidden');
                card.style.display = '';
            });
        }
        
        updateSectionVisibility();
    }
    
    // Actualizar visibilidad de secciones
    function updateSectionVisibility() {
        const sections = document.querySelectorAll('.favoritos-section');
        
        sections.forEach(section => {
            const visibleCards = section.querySelectorAll('.favorito-card:not(.hidden)');
            const isEmpty = visibleCards.length === 0;
            
            if (isEmpty && !section.classList.contains('hidden')) {
                section.style.display = 'none';
            } else if (!isEmpty && section.classList.contains('hidden')) {
                section.style.display = '';
                section.classList.remove('hidden');
            }
        });
    }
    
    // Mostrar detalles de un favorito
    function showDetails(card) {
        const title = card.dataset.title || card.querySelector('.card-title')?.textContent || 'Sin título';
        const category = card.closest('.favoritos-section')?.dataset.category || 'general';
        const description = card.querySelector('.card-description')?.textContent || 'Sin descripción disponible';
        const author = card.querySelector('.card-author')?.textContent || 'Autor desconocido';
        const rating = card.querySelector('.card-rating')?.textContent || 'Sin calificación';
        const image = card.querySelector('.card-image')?.src || '';
        
        // Determinar el tipo basado en la categoría
        let type = 'Contenido';
        const categoryIcons = {
            'libros': '📚 Libro',
            'series': '🎬 Serie',
            'anime': '🍥 Anime',
            'juegos': '🎮 Videojuego'
        };
        
        if (categoryIcons[category]) {
            type = categoryIcons[category];
        }
        
        showModal({
            title,
            type,
            description,
            author,
            rating,
            image
        });
    }
    
    // Mostrar modal de detalles
    function showModal(data) {
        // Crear modal si no existe
        let modal = document.getElementById('detailsModal');
        if (!modal) {
            modal = createModal();
        }
        
        // Llenar contenido
        const modalTitle = modal.querySelector('.modal-title');
        const modalImage = modal.querySelector('.modal-image');
        const modalDescription = modal.querySelector('.modal-description');
        const modalAuthor = modal.querySelector('.modal-author');
        const modalRating = modal.querySelector('.modal-rating');
        const modalType = modal.querySelector('.modal-type');
        
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalImage) {
            modalImage.src = data.image;
            modalImage.alt = data.title;
            modalImage.style.display = data.image ? 'block' : 'none';
        }
        if (modalDescription) modalDescription.textContent = data.description;
        if (modalAuthor) modalAuthor.textContent = data.author;
        if (modalRating) modalRating.textContent = data.rating;
        if (modalType) modalType.textContent = data.type;
        
        // Mostrar modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animación de entrada
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }
    
    // Crear modal
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'detailsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="modal-close" aria-label="Cerrar modal">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="modal-image-container">
                        <img class="modal-image" src="" alt="">
                    </div>
                    <div class="modal-details">
                        <div class="detail-item">
                            <span class="detail-label">Tipo:</span>
                            <span class="modal-type"></span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Autor/Director:</span>
                            <span class="modal-author"></span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Calificación:</span>
                            <span class="modal-rating"></span>
                        </div>
                        <div class="detail-item description">
                            <span class="detail-label">Descripción:</span>
                            <p class="modal-description"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners del modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
        
        return modal;
    }
    
    // Cerrar modal
    function closeModal() {
        const modal = document.getElementById('detailsModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    // Confirmar eliminar favorito individual
    function confirmRemoveFavorite(card, title, type, id) {
        if (confirm(`¿Estás seguro de que quieres eliminar "${title}" de tus favoritos?`)) {
            removeFavorite(card, type, id, title);
        }
    }
    
    // Eliminar favorito individual
    function removeFavorite(card, type, id, title) {
        // Animación de salida
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            card.remove();
            calculateStatistics();
            updateSectionVisibility();
            checkEmptyState();
            showToast(`"${title}" eliminado de favoritos`, 'success');
        }, 300);
        
        // Aquí harías la llamada al servidor para eliminar el favorito
        // removeFavoriteFromServer(type, id);
    }
    
    // Confirmar limpiar todos los favoritos
    function confirmClearAllFavorites() {
        const totalCount = document.querySelectorAll('.favorito-card').length;
        
        if (totalCount === 0) {
            showToast('No hay favoritos para eliminar', 'info');
            return;
        }
        
        if (confirm(`¿Estás seguro de que quieres eliminar todos los ${totalCount} favoritos? Esta acción no se puede deshacer.`)) {
            clearAllFavorites();
        }
    }
    
    // Limpiar todos los favoritos
    function clearAllFavorites() {
        const cards = document.querySelectorAll('.favorito-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                card.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    card.remove();
                    
                    // Si es la última tarjeta, mostrar estado vacío y actualizar estadísticas
                    if (index === cards.length - 1) {
                        showEmptyState();
                        calculateStatistics();
                        showToast('Todos los favoritos eliminados', 'success');
                    }
                }, 300);
            }, index * 100);
        });
        
        // Aquí harías la llamada al servidor para limpiar todos los favoritos
        // clearAllFavoritesFromServer();
    }
    
    // Verificar si debe mostrar estado vacío
    function checkEmptyState() {
        const remainingCards = document.querySelectorAll('.favorito-card');
        if (remainingCards.length === 0) {
            showEmptyState();
        }
    }
    
    // Mostrar mensaje de "sin resultados"
    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            const content = document.querySelector('.favoritos-content');
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'empty-state no-results-message';
            noResultsMsg.innerHTML = `
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5S5.806 2 10.5 2S19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>No se encontraron resultados</h3>
                <p>Prueba con otros términos de búsqueda</p>
            `;
            content.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    // Inicializar estilos del modal
    addModalStyles();
});

// Función global para eliminar favorito (llamada desde el HTML)
function eliminarFavorito(id, button) {
    const card = button.closest('.favorito-card');
    const title = card.dataset.title || card.querySelector('.card-title')?.textContent || 'Favorito';
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${title}" de tus favoritos?`)) {
        // Animación de salida
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            card.remove();
            
            // Recalcular estadísticas
            const totalFavoritosElement = document.getElementById('totalFavoritos');
            const categoriasElement = document.getElementById('categorias');
            const allCards = document.querySelectorAll('.favorito-card');
            const sections = document.querySelectorAll('.favoritos-section[data-category]');
            
            if (totalFavoritosElement) {
                totalFavoritosElement.textContent = allCards.length;
            }
            if (categoriasElement) {
                categoriasElement.textContent = sections.length;
            }
            
            // Verificar si debe mostrar estado vacío
            if (allCards.length === 0) {
                showEmptyState();
            }
            
            showToast(`"${title}" eliminado de favoritos`, 'success');
        }, 300);
        
        // Aquí harías la llamada al servidor para eliminar el favorito
        // Ejemplo de llamada AJAX:
        /*
        fetch(`/favoritos/eliminar/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('Favorito eliminado del servidor');
            }
        })
        .catch(error => {
            console.error('Error al eliminar favorito:', error);
        });
        */
    }
}

// Función para mostrar estado vacío
function showEmptyState() {
    const content = document.querySelector('.favoritos-content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.64169 1.5487 7.04096 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39465C21.7563 5.7272 21.351 5.1208 20.84 4.61Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>No tienes favoritos guardados</h3>
            <p>Comienza explorando contenido y guarda tus elementos favoritos</p>
            <a href="/search" class="btn-action primary">Explorar contenido</a>
        </div>
    `;
}

// Sistema de toast/notificaciones
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

// Agregar estilos del modal si no existen
function addModalStyles() {
    if (document.getElementById('modalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'modalStyles';
    style.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            opacity: 0;
            transition: opacity 0.3s ease;
            align-items: center;
            justify-content: center;
        }
        
        .modal.show {
            opacity: 1;
        }
        
        .modal-content {
            background-color: var(--bg-primary, #ffffff);
            border-radius: 12px;
            max-width: 600px;
            max-height: 80vh;
            width: 90%;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color, #e5e7eb);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-title {
            margin: 0;
            color: var(--primary-color, #3b82f6);
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .modal-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        
        .modal-close:hover {
            background: var(--bg-secondary, #f3f4f6);
        }
        
        .modal-close svg {
            width: 20px;
            height: 20px;
            stroke: var(--text-secondary, #6b7280);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-image-container {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .modal-image {
            max-width: 200px;
            max-height: 300px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .modal-details {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .detail-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        
        .detail-item.description {
            flex-direction: column;
            align-items: stretch;
        }
        
        .detail-label {
            font-weight: 600;
            color: var(--text-primary, #111827);
            min-width: 120px;
        }
        
        .modal-description {
            margin: 5px 0 0 0;
            line-height: 1.5;
            color: var(--text-secondary, #6b7280);
        }
        
        .section-toggle.rotated {
            transform: rotate(180deg);
        }
        
        .favoritos-grid.collapsed {
            display: none;
        }
        
        .favorito-card.hidden {
            display: none;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                max-height: 90vh;
            }
            
            .modal-header {
                padding: 15px;
            }
            
            .modal-body {
                padding: 15px;
            }
            
            .modal-title {
                font-size: 1.1rem;
            }
            
            .detail-item {
                flex-direction: column;
                gap: 4px;
            }
            
            .detail-label {
                min-width: auto;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Funciones para integración con servidor (comentadas para implementar después)
/*
function removeFavoriteFromServer(type, id) {
    fetch(`/favoritos/remove`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Favorito eliminado correctamente', 'success');
        } else {
            showToast('Error al eliminar favorito', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    });
}

function clearAllFavoritesFromServer() {
    fetch('/favoritos/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Todos los favoritos eliminados', 'success');
        } else {
            showToast('Error al eliminar favoritos', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    });
}
*/