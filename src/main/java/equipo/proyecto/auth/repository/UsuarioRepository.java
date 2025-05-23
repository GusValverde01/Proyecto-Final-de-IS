package equipo.proyecto.auth.repository;

import equipo.proyecto.auth.entity.Usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNombre(String nombre); // Método existente para buscar usuarios por nombre
}