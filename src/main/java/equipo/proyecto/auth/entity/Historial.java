package equipo.proyecto.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial")
public class Historial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId; // Relacionar con el ID del usuario

    @Column(nullable = false)
    private String busqueda; // Contenido buscado

    @Column(nullable = false)
    private LocalDateTime fecha; // Fecha de la búsqueda

    // Constructor sin argumentos
    public Historial() {
    }

    // Constructor con parámetros
    public Historial(Long usuarioId, String busqueda) {
        this.usuarioId = usuarioId;
        this.busqueda = busqueda;
        this.fecha = LocalDateTime.now(); // Establecer la fecha actual
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getBusqueda() {
        return busqueda;
    }

    public void setBusqueda(String busqueda) {
        this.busqueda = busqueda;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}
