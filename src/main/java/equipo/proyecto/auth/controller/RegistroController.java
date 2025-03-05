package equipo.proyecto.auth.controller;

import equipo.proyecto.auth.entity.Usuario;
import equipo.proyecto.auth.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class RegistroController {

    @Autowired
    private UsuarioService usuarioService;  // Inyecta el servicio de usuario para guardar en la BD

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "register";
    }

    @PostMapping("/register")
        public String registerUser(@ModelAttribute("usuario") Usuario usuario, Model model) {
            try {
                usuarioService.registrarUsuario(usuario);
                model.addAttribute("usuario", usuario);
                return "registroExitoso"; // Página de registro exitoso
            } catch (RuntimeException ex) {
                model.addAttribute("error", ex.getMessage());
                return "register"; // Redirige a la vista de registro con el error
            }
        }

}