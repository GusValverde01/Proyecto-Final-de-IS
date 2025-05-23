package equipo.proyecto.auth.service;

import equipo.proyecto.auth.model.ResultadoBusqueda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ContentSearchService {

    @Autowired
    private RestTemplate restTemplate;

    // BaseURLs de las APIs
    private static final String OPEN_LIBRARY_API_URL = "https://openlibrary.org/search.json?q=";
    private static final String TVMAZE_SEARCH_API_URL = "https://api.tvmaze.com/search/shows?q=";
    private static final String IGDB_SEARCH_URL = "https://api.igdb.com/v4/games";
    private static final String MAL_SEARCH_API = "https://api.myanimelist.net/v2/anime"; // MyAnimeList

    // Configuración para IGDB y MyAnimeList (credenciales)
    @Value("${igdb.client.id}")
    private String igdbClientId;

    @Value("${igdb.token}")
    private String igdbAccessToken;

    @Value("${mal.client.id}")
    private String malClientId;

    // ===================================================================
    // MÉTODOS DE BÚSQUEDA PARA LIBROS
    // ===================================================================
    public List<ResultadoBusqueda> searchBooks(String query) {
        List<ResultadoBusqueda> resultados = new ArrayList<>();
        try {
            String url = OPEN_LIBRARY_API_URL + query.replace(" ", "+");
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            // Procesar la respuesta y extraer libros
            List<Map<String, Object>> docs = (List<Map<String, Object>>) response.get("docs");
            if (docs != null) {
                long idCounter = 1; // Identificador temporal
                for (Map<String, Object> doc : docs) {
                    String titulo = (String) doc.get("title");
                    String autor = doc.get("author_name") != null
                            ? ((List<String>) doc.get("author_name")).get(0)
                            : "Autor desconocido";
                    String sinopsis = doc.get("first_publish_year") != null
                            ? "Primera publicación: " + doc.get("first_publish_year")
                            : "Sin información de publicación";
                    String puntuacion = "N/A"; // Open Library no tiene puntuaciones.
                    String enlace = doc.get("key") != null
                            ? "https://openlibrary.org" + doc.get("key")
                            : "#";

                    resultados.add(new ResultadoBusqueda(idCounter++, titulo, autor, sinopsis, puntuacion, enlace));
                    if (resultados.size() >= 10) break; // Máximo 10 resultados
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultados;
    }

    // ===================================================================
    // MÉTODOS DE BÚSQUEDA PARA SERIES
    // ===================================================================
    public List<ResultadoBusqueda> searchSeries(String query) {
        List<ResultadoBusqueda> resultados = new ArrayList<>();
        try {
            String url = TVMAZE_SEARCH_API_URL + query.replace(" ", "+");
            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

            long idCounter = 1; // Identificador temporal
            for (Map<String, Object> item : response) {
                Map<String, Object> show = (Map<String, Object>) item.get("show");
                String titulo = (String) show.get("name");
                String sinopsis = show.get("summary") != null ? show.get("summary").toString().replaceAll("<[^>]+>", "") : "Sin sinopsis disponible.";
                String puntuacion = show.get("rating") != null && ((Map<String, Object>) show.get("rating")).get("average") != null
                        ? ((Map<String, Object>) show.get("rating")).get("average").toString()
                        : "N/A";
                String autor = "TV Series";
                String enlace = (String) show.get("url");

                resultados.add(new ResultadoBusqueda(idCounter++, titulo, autor, sinopsis, puntuacion, enlace));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultados;
    }

    // ===================================================================
    // MÉTODOS DE BÚSQUEDA PARA VIDEOJUEGOS
    // ===================================================================
    public List<ResultadoBusqueda> searchVideoGames(String query) {
        List<ResultadoBusqueda> resultados = new ArrayList<>();
        try {
            String body = "search \"" + query + "\"; fields name, summary, rating, url; limit 10;";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Client-ID", igdbClientId);
            headers.set("Authorization", "Bearer " + igdbAccessToken);
            headers.setContentType(MediaType.TEXT_PLAIN);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<List> response = restTemplate.exchange(IGDB_SEARCH_URL, HttpMethod.POST, entity, List.class);

            List<Map<String, Object>> games = response.getBody();
            long idCounter = 1; // Identificador temporal
            for (Map<String, Object> game : games) {
                String titulo = (String) game.get("name");
                String sinopsis = game.get("summary") != null ? game.get("summary").toString() : "Sin sinopsis disponible.";
                String puntuacion = game.get("rating") != null ? game.get("rating").toString() : "N/A";
                String autor = "Videojuego";
                String enlace = game.get("url") != null ? game.get("url").toString() : "#";

                resultados.add(new ResultadoBusqueda(idCounter++, titulo, autor, sinopsis, puntuacion, enlace));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultados;
    }

    // ===================================================================
    // MÉTODOS DE BÚSQUEDA PARA ANIME
    // ===================================================================
    public List<ResultadoBusqueda> searchAnime(String query) {
        List<ResultadoBusqueda> resultados = new ArrayList<>();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-MAL-CLIENT-ID", malClientId);

            String url = MAL_SEARCH_API + "?q=" + query;
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");
            long idCounter = 1; // Identificador temporal
            if (data != null) {
                for (Map<String, Object> item : data) {
                    Map<String, Object> node = (Map<String, Object>) item.get("node");
                    String titulo = (String) node.get("title");
                    String sinopsis = node.get("synopsis") != null ? node.get("synopsis").toString() : "Sin sinopsis disponible.";
                    String puntuacion = node.get("mean") != null ? node.get("mean").toString() : "N/A";
                    String autor = "Anime";
                    String enlace = node.get("url") != null ? node.get("url").toString() : "#";

                    resultados.add(new ResultadoBusqueda(idCounter++, titulo, autor, sinopsis, puntuacion, enlace));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultados;
    }

    // Método para la búsqueda en todas las categorías
    public List<ResultadoBusqueda> searchAllCategories(String query) {
        List<ResultadoBusqueda> allResults = new ArrayList<>();
        allResults.addAll(searchBooks(query));
        allResults.addAll(searchSeries(query));
        allResults.addAll(searchVideoGames(query));
        allResults.addAll(searchAnime(query));
        return allResults;
    }
}