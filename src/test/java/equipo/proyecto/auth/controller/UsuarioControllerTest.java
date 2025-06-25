package equipo.proyecto.auth.controller;

import equipo.proyecto.auth.entity.Usuario;
import equipo.proyecto.auth.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
@TestPropertySource(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"
})
@DisplayName("Pruebas unitarias del UsuarioController")
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    private Usuario usuarioMock;

    @BeforeEach
    void setUp() {
        usuarioMock = new Usuario();
        usuarioMock.setId(1L);
        usuarioMock.setNombre("Juan Test");
        usuarioMock.setEmail("juan@test.com");
        usuarioMock.setPassword("password123");
        usuarioMock.setRoles(new HashSet<>());
    }

    @Test
    @DisplayName("POST /user/register - Debería registrar usuario correctamente")
    void deberiaRegistrarUsuarioCorrectamente() throws Exception {
        // DADO
        when(passwordEncoder.encode("password123")).thenReturn("passwordEncoded");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioMock);

        // CUANDO/ENTONCES
        mockMvc.perform(post("/user/register")
                .param("nombre", "Juan Test")
                .param("email", "juan@test.com")
                .param("password", "password123"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));

        verify(passwordEncoder, times(1)).encode("password123");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("POST /user/register - Debería codificar contraseña")
    void deberiaCodificarContrasena() throws Exception {
        // DADO
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioMock);

        // CUANDO/ENTONCES
        mockMvc.perform(post("/user/register")
                .param("nombre", "Test User")
                .param("email", "test@test.com")
                .param("password", "testpass"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));

        verify(passwordEncoder, times(1)).encode("testpass");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("POST /user/register - Debería manejar datos complejos")
    void deberiaManejarDatosComplejos() throws Exception {
        // DADO
        when(passwordEncoder.encode("Complex123!")).thenReturn("complexEncoded");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioMock);

        // CUANDO/ENTONCES
        mockMvc.perform(post("/user/register")
                .param("nombre", "Usuario Complejo 123")
                .param("email", "complejo@test.com")
                .param("password", "Complex123!"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));

        verify(passwordEncoder, times(1)).encode("Complex123!");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}