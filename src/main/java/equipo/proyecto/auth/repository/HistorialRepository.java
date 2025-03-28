package equipo.proyecto.auth.repository;

import equipo.proyecto.auth.entity.Historial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialRepository extends JpaRepository<Historial, Long> {
    // Encuentra historial por usuario (ID del usuario)
    List<Historial> findByUsuarioId(Long usuarioId);
}
