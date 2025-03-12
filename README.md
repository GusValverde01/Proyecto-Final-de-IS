Este proyecto tuvo como propósito crear un sistema login completo, con el registro de usuarios, tipos de usuarios (admin y usuario), un CRUD completo para el área de administración y la utilización del algoritmo BCrypt para encriptar contraseñas. Además de conocer las dependencias adecuadas para la correcta realización del proyecto, tales como spring-security-crypto (para encriptar password), spring-boot-starter-thymeleaf (para los archivos html), etc. Para llevar a cabo la ejecución de la aplicación es necesario hacer lo siguiente:

En la carpeta de src, accediendo a la carpeta de de main -> java se encuentra el controlador "ProyectoApplication.java" para correr el proyecto. Para ejecutar el proyecto, clona el reposiorio con: git clone https://github.com/GusValverde01/Practica1.git

Deberás cambiar el puerto mysql al que usa tu computadora en application.properties

La db del proyecto viene en el schema.sql

Accede a la carpeta del proyecto: cd Proyecto ejecutas el proyecto con maven: mvn spring-boot:run

accedes al endpoint en el navegadr con: http://localhost:8080/login

->Login
![image](https://github.com/user-attachments/assets/6181c17d-cca7-4c5b-ac49-0e0afd85d278)

->Nuevo Usuario
![image](https://github.com/user-attachments/assets/35c4088d-07a7-4acf-a00a-40266ac66e25)

![image](https://github.com/user-attachments/assets/3d5728ce-6133-487c-bdb5-eb5e853a2586)

->Vista Administrador
![image](https://github.com/user-attachments/assets/0a549380-10d2-45ea-9041-5edbca64e041)

![image](https://github.com/user-attachments/assets/72407871-6637-4775-89a2-618fef42d1f7)

->Editar Usuario
![image](https://github.com/user-attachments/assets/92c07ef6-0c54-4953-abde-e66bfefa1610)

->Crear Usuario
![image](https://github.com/user-attachments/assets/fb6c4a5f-9b5e-425e-b5e2-f290842667e0)

->Vista Usuario
![image](https://github.com/user-attachments/assets/6285b6a5-ab1d-455e-8049-c5b66bfe03e6)





