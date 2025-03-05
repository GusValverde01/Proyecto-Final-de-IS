package equipo.proyecto.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import equipo.proyecto.auth.service.CustomUserDetails;

@Controller
public class AdminController {

    @GetMapping("/admin")
    public String adminPage(Authentication authentication, Model model) {
        // Obtén el usuario autenticado
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Pasa los datos al modelo para usarlos en Thymeleaf
        model.addAttribute("nombre", userDetails.getUsername()); // Nombre
        model.addAttribute("email", userDetails.getUsuario().getEmail()); // Email
        model.addAttribute("rol", userDetails.getAuthorities()); // Roles

        return "admin"; // Retorna la página admin
    }

}
