package equipo.proyecto.auth.controller;

import equipo.proyecto.auth.entity.Historial;
import equipo.proyecto.auth.entity.Usuario;
import equipo.proyecto.auth.repository.HistorialRepository;
import equipo.proyecto.auth.repository.UsuarioRepository;
import equipo.proyecto.auth.service.ContentSearchService;
import equipo.proyecto.auth.model.ResultadoBusqueda;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ContentSearchController {

    @Autowired
    private ContentSearchService searchService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HistorialRepository historialRepository;

    // Página inicial de búsqueda
    @GetMapping("/search")
    public String searchPage() {
        return "search"; // Página de búsqueda
    }

    // Realizar búsqueda con tipos adicionales y registrar historial
    @GetMapping("/search/results")
    public String searchResults(
            @RequestParam("query") String query,
            @RequestParam("type") String type,  // Tipo: libro, serie, videojuego, anime, all
            Model model,
            Authentication authentication // Información del usuario autenticado
    ) {
        if (type.equalsIgnoreCase("all")) {
            // Para "todos", obtenemos resultados categorizados
            Map<String, List<ResultadoBusqueda>> categorizedResults = new HashMap<>();
            categorizedResults.put("libros", searchService.searchBooks(query));
            categorizedResults.put("series", searchService.searchSeries(query));
            categorizedResults.put("videojuegos", searchService.searchVideoGames(query));
            categorizedResults.put("anime", searchService.searchAnime(query));
            
            model.addAttribute("categorizedResults", categorizedResults);
            model.addAttribute("isAllSearch", true);
        } else {
            // Para búsqueda de categoría específica, mantener comportamiento actual
            List<ResultadoBusqueda> resultados;
            switch (type.toLowerCase()) {
                case "libro":
                    resultados = searchService.searchBooks(query);
                    break;
                case "serie":
                    resultados = searchService.searchSeries(query);
                    break;
                case "videojuego":
                    resultados = searchService.searchVideoGames(query);
                    break;
                case "anime":
                    resultados = searchService.searchAnime(query);
                    break;
                default:
                    model.addAttribute("error", "Tipo de búsqueda no reconocido.");
                    return "search";
            }
            model.addAttribute("results", resultados);
            model.addAttribute("isAllSearch", false);
        }
        
        model.addAttribute("query", query);
        model.addAttribute("type", type);

        // Registrar historial
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName(); // Nombre del usuario
            Usuario usuario = usuarioRepository.findByNombre(username).orElse(null);

            if (usuario != null) {
                Historial historial = new Historial(usuario.getId(), query);
                historialRepository.save(historial);
            }
        }

        return "searchResults"; // Página para mostrar los resultados
    }

    // Método de vista del historial de búsqueda
    @GetMapping("/search/history")
    public String searchHistory(Model model, Authentication authentication) {
        // Verificar si el usuario está autenticado
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName(); // Obtener el usuario autenticado
            Usuario usuario = usuarioRepository.findByNombre(username).orElse(null);

            if (usuario != null) {
                // Obtener el historial del usuario
                List<Historial> historial = historialRepository.findByUsuarioId(usuario.getId());
                model.addAttribute("historial", historial); // Pasar historial a la vista
            }
        }

        return "searchHistory"; // Retorna la página donde se mostrará el historial
    }
}