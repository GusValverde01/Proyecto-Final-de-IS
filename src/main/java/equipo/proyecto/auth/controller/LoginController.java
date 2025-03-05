    package equipo.proyecto.auth.controller;

    import equipo.proyecto.auth.service.CustomUserDetails;
    import org.springframework.security.core.Authentication;
    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.GetMapping;

    @Controller
    public class LoginController {

        @GetMapping("/login")
        public String login() {
            return "login"; 
        }

        @GetMapping("/home")
        public String homePage(Authentication authentication, Model model) {
            // Obtén el usuario autenticado
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // Pasa los datos al modelo para usarlos en Thymeleaf
            model.addAttribute("nombre", userDetails.getUsername()); // Nombre
            model.addAttribute("email", userDetails.getUsuario().getEmail()); // Email
            model.addAttribute("rol", userDetails.getAuthorities()); // Roles

            return "home"; // Retorna la página home (usuarios)
        }

        @GetMapping("/accessDenied")
        public String accessDenied() {
            return "accessDenied"; 
        }
    }
