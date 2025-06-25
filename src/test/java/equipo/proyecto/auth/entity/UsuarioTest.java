package equipo.proyecto.auth.entity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Pruebas de la entidad Usuario")
class UsuarioTest {

    @Test
    @DisplayName("Debería crear usuario con datos básicos")
    void deberiaCrearUsuarioConDatosBasicos() {
        // DADO
        Usuario usuario = new Usuario();
        
        // CUANDO
        usuario.setNombre("Juan Pérez");
        usuario.setEmail("juan@test.com");
        usuario.setPassword("password123");
        usuario.setRoles(new HashSet<>());
        
        // ENTONCES
        assertEquals("Juan Pérez", usuario.getNombre());
        assertEquals("juan@test.com", usuario.getEmail());
        assertEquals("password123", usuario.getPassword());
        assertTrue(usuario.getRoles().isEmpty());
        assertNotNull(usuario.getRoles());
    }

    @Test
    @DisplayName("Debería validar getCorreo() devuelve email")
    void deberiaValidarGetCorreoDevuelveEmail() {
        // DADO
        Usuario usuario = new Usuario();
        usuario.setEmail("test@correo.com");
        
        // CUANDO
        String correo = usuario.getCorreo();
        
        // ENTONCES
        assertEquals("test@correo.com", correo);
        assertEquals(usuario.getEmail(), correo);
    }
}