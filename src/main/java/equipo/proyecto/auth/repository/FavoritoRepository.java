package equipo.proyecto.auth.repository;

import equipo.proyecto.auth.entity.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuarioId(Long usuarioId);

    List<Favorito> findByUsuarioIdAndTipo(Long usuarioId, String tipo);

    Optional<Favorito> findByUsuarioIdAndTipoAndContenidoId(Long usuarioId, String tipo, String contenidoId);
}