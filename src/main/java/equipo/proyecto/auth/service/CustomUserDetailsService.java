package equipo.proyecto.auth.service;

import equipo.proyecto.auth.entity.Usuario;
import equipo.proyecto.auth.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("DEBUG: Buscando usuario: " + username);
        
        Optional<Usuario> usuario = usuarioRepository.findByNombre(username);
        
        if (usuario.isPresent()) {
            Usuario u = usuario.get();
            System.out.println("DEBUG: Usuario encontrado: " + u.getNombre());
            System.out.println("DEBUG: Password hash almacenado: " + u.getPassword());
            System.out.println("DEBUG: Roles: " + u.getRoles().size());
            
            return new CustomUserDetails(u);
        } else {
            System.out.println("DEBUG: Usuario no encontrado: " + username);
            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        }
    }
}