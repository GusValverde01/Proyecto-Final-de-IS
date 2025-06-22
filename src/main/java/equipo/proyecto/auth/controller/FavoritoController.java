package equipo.proyecto.auth.controller;

import equipo.proyecto.auth.entity.Favorito;
import equipo.proyecto.auth.service.FavoritoService;
import equipo.proyecto.auth.service.CustomUserDetails;
import equipo.proyecto.auth.entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @GetMapping
    public String mostrarFavoritos(Authentication authentication, Model model) {
        if (authentication != null && authentication.isAuthenticated()) {
            Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();

            List<Favorito> libros = favoritoService.obtenerFavoritosPorUsuarioYTipo(usuario.getId(), "libro");
            List<Favorito> series = favoritoService.obtenerFavoritosPorUsuarioYTipo(usuario.getId(), "serie");

            model.addAttribute("libros", libros);
            model.addAttribute("series", series);
            model.addAttribute("usuario", usuario);

            return "favoritos";
        }
        return "redirect:/login";
    }

    @PostMapping("/agregar")
    @ResponseBody
    public ResponseEntity<?> agregarFavorito(@RequestParam String tipo, @RequestParam String contenidoId,
                                             @RequestParam String titulo, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {
            Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();

            Favorito favorito = new Favorito(usuario.getId(), tipo, contenidoId, titulo);
            favoritoService.guardarFavorito(favorito);

            response.put("success", true);
            response.put("mensaje", "Añadido a favoritos correctamente");
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("mensaje", "Debe iniciar sesión para agregar favoritos");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/eliminar")
@ResponseBody
public ResponseEntity<?> eliminarFavorito(@RequestParam Long id, Authentication authentication) {
    Map<String, Object> response = new HashMap<>();
    if (authentication != null && authentication.isAuthenticated()) {
        boolean eliminado = favoritoService.eliminarFavoritoPorId(id);
        response.put("success", eliminado);
        response.put("mensaje", eliminado ? "Eliminado correctamente" : "No se pudo eliminar");
        return ResponseEntity.ok(response);
    }
    response.put("success", false);
    response.put("mensaje", "Debe iniciar sesión para eliminar favoritos");
    return ResponseEntity.badRequest().body(response);
}
}