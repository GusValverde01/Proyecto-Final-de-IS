# Proyecto Final de Ingenieria de Software

Este proyecto tiene como propósito la gestión de usuarios que permite la búsqueda multimodad de contenido entre series, anime, películas y videojuegos. Implementado en Spring Boot, que incluye funcionalidades de registro, login, administración de usuarios y diferenciación de permisos entre roles de administrador y usuario regular.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- **config**: Contiene las configuraciones de seguridad y aplicación.
  - `AppConfig.java`
  - `SecurityConfig.java`
- **controller**: Contiene los controladores de la aplicación.
  - `AdminController.java`
  - `AdminUserController.java`
  - `ApiAuthController.java`
  - `ContentSearchController.java`
  - `LoginController.java`
  - `RegistroController.java`
  - `UsuarioController.java`
- **entity**: Contiene las entidades JPA.
  - `Historial.java`
  - `Rol.java`
  - `Usuario.java`
- **model**: Contiene los modelos de datos.
  - `ResultadoBusqueda.java`
- **repository**: Contiene los repositorios JPA.
  - `HistorialRepository.java`
  - `RolRepository.java`
  - `UsuarioRepository.java`
- **service**: Contiene los servicios de la aplicación.
  - `ContentSearchService.java`
- **resources**: Contiene los recursos estáticos y las configuraciones.
  - `application.properties`

## Comentarios Relevantes en el Código

- **SecurityConfig.java**: Configura la seguridad de la aplicación, incluyendo la autenticación y autorización.
- **AdminController.java**: Controlador para manejar las vistas del administrador.
- **ApiAuthController.java**: Controlador para manejar la autenticación vía API.

## Evidencias de Funcionamiento

### Proceso de Registro, Login y Busqueda

- Página de Login
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225723.png?raw=true)
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225733.png?raw=true)

- Página de Registro de Nuevo Usuario
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225815.png?raw=true)
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225837.png?raw=true)

- Página de home
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225856.png?raw=true)

### Funcionamiento del Caso de Uso Principal

- Historial de busquedas
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225902.png?raw=true)
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225908.png?raw=true)

- Buscar contenido
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225922.png?raw=true)

- Resultados generales
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225933.png?raw=true)
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225938.png?raw=true)
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225945.png?raw=true)
![image](https://github.com/GusValverde01/Proyecto-Final-de-IS/blob/main/Capturas/Screenshot%202025-04-04%20225952.png?raw=true)

### Diferencia de Permisos entre Roles

- Los usuarios con rol `ADMINISTRADOR` tienen acceso a las vistas de administración, donde pueden listar, editar y eliminar usuarios.
- Los usuarios con rol `USER` solo tienen acceso a las vistas de usuario.

### Cambio entre Tema Claro y Oscuro

- La aplicación incluye un toggle para cambiar entre tema claro y oscuro, almacenando la preferencia del usuario en el local storage del navegador.

## Informe de Implementación

### Registro de Usuarios

1. El usuario accede a la página de registro.
2. Completa el formulario de registro con su nombre, correo electrónico y contraseña.
3. El formulario se envía al controlador `RegistroController`, que llama al servicio `UsuarioService` para guardar el nuevo usuario en la base de datos.
4. El usuario es redirigido a la página de login.

### Login de Usuarios

1. El usuario accede a la página de login.
2. Completa el formulario de login con su correo electrónico y contraseña.
3. El formulario se envía al controlador `LoginController`, que autentica al usuario utilizando Spring Security.
4. Si la autenticación es exitosa, el usuario es redirigido a la página de inicio.

### Funcionalidad Principal

- La funcionalidad principal del sistema incluye la búsqueda de contenido (libros, series, videojuegos, anime) y el registro de historial de búsqueda para cada usuario.
- Los resultados de búsqueda se obtienen utilizando el servicio `ContentSearchService`, que realiza peticiones a diferentes APIs externas.

### Diferencias de Permisos

- La configuración de seguridad en `SecurityConfig.java` define las rutas que requieren autenticación y los roles necesarios para acceder a ciertas páginas.
- Los administradores tienen acceso a las funcionalidades de gestión de usuarios, mientras que los usuarios regulares solo pueden ver su propio perfil e historial de búsqueda.

## Cómo Ejecutar el Proyecto

1. **Clonar el repositorio:**
   ```sh
   git clone https://github.com/GusValverde01/Proyecto-Final-de-IS.git

2. **Ejecuta la aplicación con Docker Compose:**
    ```sh
    docker-compose up --build
    ```
3. **Acceder al endpoint:**
    ```
    En el navegadr: http://localhost:8080/login
    ```
## Cómo Ejecutar el Proyecto si prefieres no usar Docker

1. **Clonar el repositorio:**
   ```sh
   git clone https://github.com/GusValverde01/Proyecto-Final-de-IS.git

2. **Compilar con maven:**
    ```sh
    mvn spring-boot:run
    ```
3. **Acceder al endpoint:**
    ```
    En el navegadr: http://localhost:8080/login
    ```
