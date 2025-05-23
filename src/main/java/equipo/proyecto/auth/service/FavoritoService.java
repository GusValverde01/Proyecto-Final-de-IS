package equipo.proyecto.auth.service;

import equipo.proyecto.auth.entity.Favorito;
import equipo.proyecto.auth.repository.FavoritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    public List<Favorito> obtenerFavoritosPorUsuario(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId);
    }

    public List<Favorito> obtenerFavoritosPorUsuarioYTipo(Long usuarioId, String tipo) {
        return favoritoRepository.findByUsuarioIdAndTipo(usuarioId, tipo);
    }

    @Transactional
    public Favorito guardarFavorito(Favorito favorito) {
        Optional<Favorito> favoritoExistente = favoritoRepository
                .findByUsuarioIdAndTipoAndContenidoId(favorito.getUsuarioId(), favorito.getTipo(), favorito.getContenidoId());

        return favoritoExistente.orElseGet(() -> favoritoRepository.save(favorito));
    }

    @Transactional
    public void eliminarFavorito(Long id) {
        favoritoRepository.deleteById(id);
    }
}