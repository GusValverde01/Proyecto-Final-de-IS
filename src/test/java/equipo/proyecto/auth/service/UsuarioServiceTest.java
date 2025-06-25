package equipo.proyecto.auth.service;

import equipo.proyecto.auth.entity.Usuario;
import equipo.proyecto.auth.entity.Rol;
import equipo.proyecto.auth.repository.UsuarioRepository;
import equipo.proyecto.auth.repository.RolRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas unitarias del UsuarioService")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioMock;
    private Rol rolMock;

    @BeforeEach
    void setUp() {
        usuarioMock = new Usuario();
        usuarioMock.setId(1L);
        usuarioMock.setNombre("Juan Test");
        usuarioMock.setEmail("juan@test.com");
        usuarioMock.setPassword("password123");
        usuarioMock.setRoles(new HashSet<>());

        rolMock = new Rol();
        rolMock.setId(1L);
        rolMock.setNombre("ROLE_USUARIO");
    }

    @Test
    @DisplayName("Debería registrar nuevo usuario correctamente")
    void deberiaRegistrarNuevoUsuarioCorrectamente() {
        // DADO
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre("Nuevo Usuario");
        nuevoUsuario.setEmail("nuevo@test.com");
        nuevoUsuario.setPassword("password123");

        when(usuarioRepository.findByNombre("Nuevo Usuario")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("passwordEncoded");
        when(rolRepository.findByNombre("ROLE_USUARIO")).thenReturn(Optional.of(rolMock));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(nuevoUsuario);

        // CUANDO
        usuarioService.registrarUsuario(nuevoUsuario);

        // ENTONCES
        verify(usuarioRepository, times(1)).findByNombre("Nuevo Usuario");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(rolRepository, times(1)).findByNombre("ROLE_USUARIO");
        verify(usuarioRepository, times(1)).save(nuevoUsuario);
        assertEquals("passwordEncoded", nuevoUsuario.getPassword());
        assertEquals(1, nuevoUsuario.getRoles().size());
    }

    @Test
    @DisplayName("Debería lanzar excepción si usuario ya existe al registrar")
    void deberiaLanzarExcepcionSiUsuarioYaExiste() {
        // DADO
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setNombre("Usuario Existente");

        when(usuarioRepository.findByNombre("Usuario Existente")).thenReturn(Optional.of(usuarioMock));

        // CUANDO/ENTONCES
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.registrarUsuario(usuarioExistente);
        });

        assertEquals("El usuario con ese nombre ya está registrado.", exception.getMessage());
        verify(usuarioRepository, times(1)).findByNombre("Usuario Existente");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Debería lanzar excepción si rol USUARIO no existe")
    void deberiaLanzarExcepcionSiRolUsuarioNoExiste() {
        // DADO
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre("Test Usuario");
        nuevoUsuario.setPassword("password123");

        when(usuarioRepository.findByNombre("Test Usuario")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("passwordEncoded");
        when(rolRepository.findByNombre("ROLE_USUARIO")).thenReturn(Optional.empty());

        // CUANDO/ENTONCES
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.registrarUsuario(nuevoUsuario);
        });

        assertEquals("El rol USUARIO no existe en la base de datos.", exception.getMessage());
        verify(rolRepository, times(1)).findByNombre("ROLE_USUARIO");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Debería listar todos los usuarios")
    void deberiaListarTodosLosUsuarios() {
        // DADO
        Usuario usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setNombre("María Test");
        usuario2.setEmail("maria@test.com");

        List<Usuario> usuariosMock = Arrays.asList(usuarioMock, usuario2);
        when(usuarioRepository.findAll()).thenReturn(usuariosMock);

        // CUANDO
        List<Usuario> resultado = usuarioService.listarUsuarios();

        // ENTONCES
        assertEquals(2, resultado.size());
        assertEquals("Juan Test", resultado.get(0).getNombre());
        assertEquals("María Test", resultado.get(1).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debería obtener usuario por ID")
    void deberiaObtenerUsuarioPorId() {
        // DADO
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioMock));

        // CUANDO
        Optional<Usuario> resultado = usuarioService.obtenerUsuarioPorId(1L);

        // ENTONCES
        assertTrue(resultado.isPresent());
        assertEquals("Juan Test", resultado.get().getNombre());
        assertEquals("juan@test.com", resultado.get().getEmail());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Debería retornar vacío si usuario no existe por ID")
    void deberiaRetornarVacioSiUsuarioNoExistePorId() {
        // DADO
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // CUANDO
        Optional<Usuario> resultado = usuarioService.obtenerUsuarioPorId(999L);

        // ENTONCES
        assertFalse(resultado.isPresent());
        verify(usuarioRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Debería guardar nuevo usuario y codificar contraseña")
    void deberiaGuardarNuevoUsuarioYCodificarContrasena() {
        // DADO
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setId(null); // Usuario nuevo
        nuevoUsuario.setNombre("Nuevo Usuario");
        nuevoUsuario.setPassword("password123");

        when(passwordEncoder.encode("password123")).thenReturn("passwordEncoded");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(nuevoUsuario);

        // CUANDO
        usuarioService.guardarUsuario(nuevoUsuario);

        // ENTONCES
        verify(passwordEncoder, times(1)).encode("password123");
        verify(usuarioRepository, times(1)).save(nuevoUsuario);
        assertEquals("passwordEncoded", nuevoUsuario.getPassword());
    }

    @Test
    @DisplayName("Debería actualizar usuario existente sin cambiar contraseña")
    void deberiaActualizarUsuarioExistenteSinCambiarContrasena() {
        // DADO
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(1L);
        usuarioExistente.setNombre("Usuario Original");
        usuarioExistente.setPassword("passwordOriginalEncoded");

        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setId(1L);
        usuarioActualizado.setNombre("Usuario Actualizado");
        usuarioActualizado.setPassword("passwordOriginalEncoded"); // Misma contraseña

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioActualizado);

        // CUANDO
        usuarioService.guardarUsuario(usuarioActualizado);

        // ENTONCES
        verify(usuarioRepository, times(1)).findById(1L);
        verify(passwordEncoder, never()).encode(anyString()); // No se recodifica
        verify(usuarioRepository, times(1)).save(usuarioActualizado);
        assertEquals("passwordOriginalEncoded", usuarioActualizado.getPassword());
    }

    @Test
    @DisplayName("Debería actualizar usuario existente y recodificar nueva contraseña")
    void deberiaActualizarUsuarioExistenteYRecodificarNuevaContrasena() {
        // DADO
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(1L);
        usuarioExistente.setPassword("passwordOriginalEncoded");

        Usuario usuarioConNuevaPassword = new Usuario();
        usuarioConNuevaPassword.setId(1L);
        usuarioConNuevaPassword.setPassword("nuevaPassword123");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));
        when(passwordEncoder.encode("nuevaPassword123")).thenReturn("nuevaPasswordEncoded");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioConNuevaPassword);

        // CUANDO
        usuarioService.guardarUsuario(usuarioConNuevaPassword);

        // ENTONCES
        verify(usuarioRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).encode("nuevaPassword123");
        verify(usuarioRepository, times(1)).save(usuarioConNuevaPassword);
        assertEquals("nuevaPasswordEncoded", usuarioConNuevaPassword.getPassword());
    }

    @Test
    @DisplayName("Debería lanzar excepción al actualizar usuario inexistente")
    void deberiaLanzarExcepcionAlActualizarUsuarioInexistente() {
        // DADO
        Usuario usuarioInexistente = new Usuario();
        usuarioInexistente.setId(999L);

        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // CUANDO/ENTONCES
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.guardarUsuario(usuarioInexistente);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(usuarioRepository, times(1)).findById(999L);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Debería eliminar usuario por ID")
    void deberiaEliminarUsuarioPorId() {
        // DADO
        doNothing().when(usuarioRepository).deleteById(1L);

        // CUANDO
        usuarioService.eliminarUsuario(1L);

        // ENTONCES
        verify(usuarioRepository, times(1)).deleteById(1L);
    }
}