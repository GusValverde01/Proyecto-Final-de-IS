package equipo.proyecto.auth.controller;

import equipo.proyecto.auth.entity.Usuario;
import equipo.proyecto.auth.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMINISTRADOR')") // Asegura que únicamente administradores accedan
public class AdminUserController {

@Autowired
private UsuarioService usuarioService;

// LISTAR TODOS LOS USUARIOS
@GetMapping
public String listUsers(Model model) {
List<Usuario> usuarios = usuarioService.listarUsuarios();
model.addAttribute("usuarios", usuarios);
return "user-list"; // Una vista para listar usuarios
}

// MOSTRAR FORMULARIO PARA CREAR/EDITAR UN USUARIO
@GetMapping("/edit/{id}")
public String showEditForm(@PathVariable("id") Long id, Model model) {
if (id == 0) {
// Crear un nuevo usuario
model.addAttribute("usuario", new Usuario()); // Crea un usuario vacío
return "user-edit"; // Redirige a la vista del formulario
}

// Editar un usuario existente
Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorId(id);
if (!usuario.isPresent()) {
return "redirect:/admin/users"; // Redirige si el usuario no existe
}

model.addAttribute("usuario", usuario.get());
return "user-edit"; // Vista para editar usuarios
}

// ACTUALIZAR USUARIO EXISTENTE O CREAR UN NUEVO USUARIO
@PostMapping("/save")
public String saveUser(@ModelAttribute("usuario") Usuario usuario) {
usuarioService.guardarUsuario(usuario);
return "redirect:/admin/users";
}

// MOSTRAR FORMULARIO PARA CREAR UN NUEVO USUARIO
@GetMapping("/create")
public String showCreateForm(Model model) {
model.addAttribute("usuario", new Usuario()); // Crea un objeto vacío de Usuario
return "create-user"; // Redirige al formulario de Thymeleaf
}

// ELIMINAR UN USUARIO
@GetMapping("/delete/{id}")
public String deleteUser(@PathVariable("id") Long id) {
usuarioService.eliminarUsuario(id);
return "redirect:/admin/users";
}
}