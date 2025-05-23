package equipo.proyecto.auth.model;

public class ResultadoBusqueda {

    private Long id; // Nuevo atributo agregado
    private String titulo;
    private String autor;
    private String descripcion;
    private String puntuacion;
    private String enlace;

    // Constructor
    public ResultadoBusqueda(Long id, String titulo, String autor, String descripcion, String puntuacion, String enlace) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.descripcion = descripcion;
        this.puntuacion = puntuacion;
        this.enlace = enlace;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(String puntuacion) {
        this.puntuacion = puntuacion;
    }

    public String getEnlace() {
        return enlace;
    }

    public void setEnlace(String enlace) {
        this.enlace = enlace;
    }
}