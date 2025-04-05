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

### Proceso de Registro y Login

- Página de Login
![image](https://github.com/user-attachments/assets/6181c17d-cca7-4c5b-ac49-0e0afd85d278)

- Página de Registro de Nuevo Usuario
![image](https://github.com/user-attachments/assets/35c4088d-07a7-4acf-a00a-40266ac66e25)
![image](https://github.com/user-attachments/assets/3d5728ce-6133-487c-bdb5-eb5e853a2586)

### Funcionamiento del Caso de Uso Principal

- Vista del Administrador
![image](https://github.com/user-attachments/assets/0a549380-10d2-45ea-9041-5edbca64e041)
![image](https://github.com/user-attachments/assets/72407871-6637-4775-89a2-618fef42d1f7)

- Edición de Usuario
![image](https://github.com/user-attachments/assets/92c07ef6-0c54-4953-abde-e66bfefa1610)

- Creación de Usuario
![image](https://github.com/user-attachments/assets/fb6c4a5f-9b5e-425e-b5e2-f290842667e0)

- Vista del Usuario
![image](https://github.com/user-attachments/assets/6285b6a5-ab1d-455e-8049-c5b66bfe03e6)

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

1. Clona el repositorio con:
   ```sh
   git clone https://github.com/GusValverde01/Proyecto-Final-de-IS.git

![image](https://github.com/user-attachments/assets/6285b6a5-ab1d-455e-8049-c5b66bfe03e6)





