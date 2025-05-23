package equipo.proyecto.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favoritos")
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private String tipo;

    @Column(name = "contenido_id", nullable = false)
    private String contenidoId;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "fecha_guardado")
    private LocalDateTime fechaGuardado;

    public Favorito() {}

    public Favorito(Long usuarioId, String tipo, String contenidoId, String titulo) {
        this.usuarioId = usuarioId;
        this.tipo = tipo;
        this.contenidoId = contenidoId;
        this.titulo = titulo;
        this.fechaGuardado = LocalDateTime.now();
    }

    // Getters
    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getTipo() {
        return tipo;
    }

    public String getContenidoId() {
        return contenidoId;
    }

    public String getTitulo() {
        return titulo;
    }

    public LocalDateTime getFechaGuardado() {
        return fechaGuardado;
    }

    // Setters (opcional, si los necesitas)
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setContenidoId(String contenidoId) {
        this.contenidoId = contenidoId;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setFechaGuardado(LocalDateTime fechaGuardado) {
        this.fechaGuardado = fechaGuardado;
    }
}