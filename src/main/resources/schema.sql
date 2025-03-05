-- Crear la base de datos "proyectosistema"
CREATE DATABASE proyectosistema CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Usar la base de datos "proyectosistema"
USE proyectosistema;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- Identificador único del usuario
    nombre VARCHAR(64) NOT NULL, -- Nombre del usuario
    email VARCHAR(64) NOT NULL UNIQUE, -- Email único
    password VARCHAR(128) NOT NULL -- Contraseña
);

-- Tabla de roles
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- Identificador único del rol
    nombre VARCHAR(64) NOT NULL UNIQUE -- Nombre único del rol
);

-- Relación muchos a muchos entre usuarios y roles
CREATE TABLE usuario_roles (
    usuario_id BIGINT, -- Clave foránea que referencia a usuarios
    rol_id BIGINT, -- Clave foránea que referencia a roles
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE, -- Eliminación en cascada
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE -- Eliminación en cascada
);

-- Tabla para almacenar búsquedas realizadas
CREATE TABLE historial (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- Identificador único de registro
    usuario_id BIGINT NOT NULL, -- Usuario que realizó la búsqueda
    busqueda VARCHAR(256) NOT NULL, -- Palabra clave o texto buscado
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de la búsqueda
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE -- Eliminación en cascada
);

-- Tabla para los favoritos
CREATE TABLE favoritos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- Identificador único del favorito
    usuario_id BIGINT NOT NULL, -- Usuario que guardó el favorito
    tipo ENUM('libro', 'serie', 'videojuego', 'anime') NOT NULL, -- Tipo de contenido favorito
    contenido_id VARCHAR(64) NOT NULL, -- Identificador del contenido (relativo a la fuente, p. ej., ID en APIs externas)
    titulo VARCHAR(255) NOT NULL, -- Título del contenido
    fecha_guardado TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha en la que fue marcado como favorito
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE -- Eliminación en cascada
);

-- Tabla para el registro de contenido (utilizada para almacenar datos enriquecidos por ETL)
CREATE TABLE contenido (
    id VARCHAR(64) PRIMARY KEY, -- Identificador único del contenido (relativo a las APIs externas o ETL)
    tipo ENUM('libro', 'serie', 'videojuego', 'anime') NOT NULL, -- Tipo de contenido
    titulo VARCHAR(255) NOT NULL, -- Título del contenido
    autor_creador VARCHAR(128), -- Autor o creador
    sinopsis TEXT, -- Descripción o sinopsis del contenido
    fecha_lanzamiento DATE, -- Fecha de lanzamiento
    puntuacion DECIMAL(3, 2), -- Puntuación o calificación
    enlace VARCHAR(255) -- Enlace relevante (como URL hacia información del contenido)
);

-- Tabla para almacenar configuración y patrones para recomendaciones
CREATE TABLE recomendaciones (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- Identificador único
    contenido_id VARCHAR(64) NOT NULL, -- Contenido base para generar la recomendación (relacionado a contenido)
    recomendado_id VARCHAR(64) NOT NULL, -- Contenido recomendado (relacionado a contenido)
    peso DECIMAL(5, 2) DEFAULT 1.0, -- Grado de relación o relevancia
    FOREIGN KEY (contenido_id) REFERENCES contenido(id) ON DELETE CASCADE, -- Eliminación en cascada
    FOREIGN KEY (recomendado_id) REFERENCES contenido(id) ON DELETE CASCADE
);

-- Insertar roles iniciales
INSERT INTO roles (nombre) VALUES ('ROLE_ADMINISTRADOR'), ('ROLE_USUARIO');

-- Crear el usuario administrador
DROP USER IF EXISTS 'admin'@'localhost';
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON proyectosistema.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
