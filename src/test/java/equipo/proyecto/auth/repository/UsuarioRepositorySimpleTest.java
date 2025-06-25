package equipo.proyecto.auth.repository;

import equipo.proyecto.auth.entity.Usuario;
import equipo.proyecto.auth.entity.Rol;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.DirtiesContext;

import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@DisplayName("Pruebas simples del Usuario en BD")
class UsuarioRepositorySimpleTest {

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("Debería guardar usuario básico sin roles")
    void deberiaGuardarUsuarioBasico() {
        // DADO
        Usuario usuario = new Usuario();
        usuario.setNombre("Test User");
        usuario.setEmail("test@test.com");
        usuario.setPassword("password123");
        usuario.setRoles(new HashSet<>()); // Sin roles inicialmente
        
        // CUANDO
        Usuario usuarioGuardado = entityManager.persistAndFlush(usuario);
        entityManager.clear(); // Limpiar contexto de persistencia
        
        // ENTONCES
        assertNotNull(usuarioGuardado.getId());
        assertEquals("Test User", usuarioGuardado.getNombre());
        assertEquals("test@test.com", usuarioGuardado.getEmail());
        assertTrue(usuarioGuardado.getRoles().isEmpty());
    }

    @Test
    @DisplayName("Debería encontrar usuario por ID")
    void deberiaEncontrarUsuarioPorId() {
        // DADO
        Usuario usuario = new Usuario();
        usuario.setNombre("Otro User");
        usuario.setEmail("otro@test.com");
        usuario.setPassword("password456");
        usuario.setRoles(new HashSet<>());
        
        Usuario usuarioGuardado = entityManager.persistAndFlush(usuario);
        Long usuarioId = usuarioGuardado.getId();
        entityManager.clear();
        
        // CUANDO
        Usuario usuarioEncontrado = entityManager.find(Usuario.class, usuarioId);
        
        // ENTONCES
        assertNotNull(usuarioEncontrado);
        assertEquals("Otro User", usuarioEncontrado.getNombre());
        assertEquals("otro@test.com", usuarioEncontrado.getEmail());
    }

    @Test
    @DisplayName("Debería guardar usuario con rol")
    void deberiaGuardarUsuarioConRol() {
        // DADO - Crear rol primero
        Rol rol = new Rol();
        rol.setNombre("USER");
        Rol rolGuardado = entityManager.persistAndFlush(rol);
        
        // Crear usuario con rol
        Usuario usuario = new Usuario();
        usuario.setNombre("Usuario Con Rol");
        usuario.setEmail("conrol@test.com");
        usuario.setPassword("password789");
        usuario.getRoles().add(rolGuardado);
        
        // CUANDO
        Usuario usuarioGuardado = entityManager.persistAndFlush(usuario);
        entityManager.clear();
        
        // Buscar usuario
        Usuario usuarioRecuperado = entityManager.find(Usuario.class, usuarioGuardado.getId());
        
        // ENTONCES
        assertNotNull(usuarioRecuperado);
        assertEquals("Usuario Con Rol", usuarioRecuperado.getNombre());
        assertEquals(1, usuarioRecuperado.getRoles().size());
        assertTrue(usuarioRecuperado.getRoles().stream()
                  .anyMatch(r -> r.getNombre().equals("USER")));
    }
}