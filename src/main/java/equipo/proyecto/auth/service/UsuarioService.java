package equipo.proyecto.auth.service;

import equipo.proyecto.auth.entity.Rol;
import equipo.proyecto.auth.entity.Usuario;
import equipo.proyecto.auth.repository.RolRepository;
import equipo.proyecto.auth.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTRAR NUEVO USUARIO
    public void registrarUsuario(Usuario usuario) {
        Optional<Usuario> existingUser = usuarioRepository.findByNombre(usuario.getNombre());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El usuario con ese nombre ya está registrado.");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        Optional<Rol> optionalRol = rolRepository.findByNombre("USUARIO");
        if (optionalRol.isPresent()) {
            Set<Rol> roles = new HashSet<>();
            roles.add(optionalRol.get());
            usuario.setRoles(roles);
        } else {
            throw new RuntimeException("El rol USUARIO no existe en la base de datos.");
        }

        usuarioRepository.save(usuario);
    }

    // LISTAR TODOS LOS USUARIOS
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // OBTENER USUARIO POR ID
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // GUARDAR USUARIO (crear o actualizar)
    public void guardarUsuario(Usuario usuario) {
        if (usuario.getId() == null) { 
            // Usuario nuevo -> Codificar la contraseña
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        } else {
            // El usuario ya existe -> Buscar la contraseña actual si no se modificó
            Usuario usuarioExistente = usuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); // Manejo de casos de error
            
            // Si la contraseña enviada en el formulario es diferente, recodificar
            if (!usuarioExistente.getPassword().equals(usuario.getPassword())) {
                usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            } else {
                // Si la contraseña no cambió, usamos la anterior
                usuario.setPassword(usuarioExistente.getPassword());
            }
        }

        // Guardar el usuario (ya sea nuevo o actualizado)
        usuarioRepository.save(usuario);
    }

    // ELIMINAR USUARIO
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

}

