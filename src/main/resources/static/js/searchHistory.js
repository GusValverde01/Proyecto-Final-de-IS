document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const searchFilter = document.getElementById('searchFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearButton = document.getElementById('clearHistory');
    const historyGrid = document.getElementById('historyGrid');
    const uniqueSearchesElement = document.getElementById('uniqueSearches');
    
    // Inicializar
    calculateUniqueSearches();
    setupEventListeners();
    
    // Calcular búsquedas únicas
    function calculateUniqueSearches() {
        if (!historyGrid) return;
        
        const items = historyGrid.querySelectorAll('.history-item');
        const uniqueSearches = new Set();
        
        items.forEach(item => {
            const searchTerm = item.dataset.search;
            if (searchTerm) {
                uniqueSearches.add(searchTerm.toLowerCase());
            }
        });
        
        if (uniqueSearchesElement) {
            uniqueSearchesElement.textContent = uniqueSearches.size;
        }
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Filtro de búsqueda
        if (searchFilter) {
            searchFilter.addEventListener('input', filterHistory);
        }
        
        // Ordenamiento
        if (sortFilter) {
            sortFilter.addEventListener('change', sortHistory);
        }
        
        // Limpiar historial
        if (clearButton) {
            clearButton.addEventListener('click', confirmClearHistory);
        }
        
        // Botones de repetir búsqueda
        document.querySelectorAll('.repeat-search').forEach(btn => {
            btn.addEventListener('click', function() {
                const searchTerm = this.dataset.search;
                if (searchTerm) {
                    repeatSearch(searchTerm);
                }
            });
        });
        
        // Botones de eliminar item
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.dataset.index;
                if (index !== undefined) {
                    confirmDeleteItem(this.closest('.history-item'), index);
                }
            });
        });
    }
    
    // Filtrar historial
    function filterHistory() {
        if (!historyGrid) return;
        
        const filterValue = searchFilter.value.toLowerCase();
        const items = historyGrid.querySelectorAll('.history-item');
        
        items.forEach(item => {
            const searchTerm = item.dataset.search.toLowerCase();
            const shouldShow = searchTerm.includes(filterValue);
            
            if (shouldShow) {
                item.classList.remove('hidden');
                item.style.display = '';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        const visibleItems = historyGrid.querySelectorAll('.history-item:not(.hidden)');
        showNoResultsMessage(visibleItems.length === 0 && filterValue !== '');
    }
    
    // Ordenar historial
    function sortHistory() {
        if (!historyGrid) return;
        
        const items = Array.from(historyGrid.querySelectorAll('.history-item'));
        const sortType = sortFilter.value;
        
        items.sort((a, b) => {
            switch (sortType) {
                case 'newest':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                case 'oldest':
                    return new Date(a.dataset.date) - new Date(b.dataset.date);
                case 'alphabetical':
                    return a.dataset.search.localeCompare(b.dataset.search);
                default:
                    return 0;
            }
        });
        
        // Reorganizar elementos
        items.forEach(item => historyGrid.appendChild(item));
        
        // Animar la reorganización
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 50}ms`;
            item.classList.add('reorder-animation');
        });
        
        setTimeout(() => {
            items.forEach(item => {
                item.classList.remove('reorder-animation');
                item.style.animationDelay = '';
            });
        }, 1000);
    }
    
    // Repetir búsqueda
    function repeatSearch(searchTerm) {
        // Crear formulario temporal para enviar la búsqueda
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/search';
        form.style.display = 'none';
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'query';
        input.value = searchTerm;
        
        form.appendChild(input);
        document.body.appendChild(form);
        
        // Mostrar feedback
        showToast(`Repitiendo búsqueda: "${searchTerm}"`, 'info');
        
        // Enviar formulario
        setTimeout(() => {
            form.submit();
        }, 500);
    }
    
    // Confirmar eliminar item
    function confirmDeleteItem(itemElement, index) {
        const searchTerm = itemElement.dataset.search;
        
        if (confirm(`¿Estás seguro de que quieres eliminar "${searchTerm}" del historial?`)) {
            deleteHistoryItem(itemElement, index);
        }
    }
    
    // Eliminar item del historial
    function deleteHistoryItem(itemElement, index) {
        // Animación de salida
        itemElement.style.transform = 'translateX(-100%)';
        itemElement.style.opacity = '0';
        
        setTimeout(() => {
            itemElement.remove();
            calculateUniqueSearches();
            updateStatistics();
            showToast('Búsqueda eliminada del historial', 'success');
        }, 300);
        
        // Aquí podrías agregar una llamada AJAX para eliminar del servidor
        // deleteFromServer(index);
    }
    
    // Confirmar limpiar historial
    function confirmClearHistory() {
        const itemCount = historyGrid ? historyGrid.querySelectorAll('.history-item').length : 0;
        
        if (itemCount === 0) {
            showToast('El historial ya está vacío', 'info');
            return;
        }
        
        if (confirm(`¿Estás seguro de que quieres eliminar todas las ${itemCount} búsquedas del historial? Esta acción no se puede deshacer.`)) {
            clearAllHistory();
        }
    }
    
    // Limpiar todo el historial
    function clearAllHistory() {
        if (!historyGrid) return;
        
        const items = historyGrid.querySelectorAll('.history-item');
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(-20px)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    item.remove();
                    
                    // Si es el último item, mostrar estado vacío
                    if (index === items.length - 1) {
                        showEmptyState();
                        updateStatistics();
                        showToast('Historial limpiado completamente', 'success');
                    }
                }, 200);
            }, index * 100);
        });
        
        // Aquí podrías agregar una llamada AJAX para limpiar del servidor
        // clearHistoryOnServer();
    }
    
    // Mostrar estado vacío
    function showEmptyState() {
        if (!historyGrid) return;
        
        historyGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>No hay búsquedas registradas</h3>
                <p>Comienza explorando contenido para ver tu historial aquí</p>
                <a href="/search" class="btn-action primary">Realizar primera búsqueda</a>
            </div>
        `;
    }
    
    // Actualizar estadísticas
    function updateStatistics() {
        const totalElement = document.querySelector('.stat-number');
        const items = historyGrid ? historyGrid.querySelectorAll('.history-item') : [];
        
        if (totalElement) {
            totalElement.textContent = items.length;
        }
        
        calculateUniqueSearches();
    }
    
    // Mostrar mensaje de "sin resultados"
    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'empty-state no-results-message';
            noResultsMsg.innerHTML = `
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5S5.806 2 10.5 2S19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>No se encontraron búsquedas</h3>
                <p>Intenta con otros términos de búsqueda</p>
            `;
            historyGrid.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
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
            maxWidth: '300px'
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
    
    // Animación de reordenamiento
    const style = document.createElement('style');
    style.textContent = `
        .reorder-animation {
            animation: reorderPulse 0.5s ease;
        }
        
        @keyframes reorderPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});