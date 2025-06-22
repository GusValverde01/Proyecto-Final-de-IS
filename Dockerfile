FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Actualizar paquetes del sistema para reducir vulnerabilidades
RUN apt-get update && apt-get upgrade -y && apt-get install -y netcat && apt-get clean

# Copiar el archivo pom.xml y descargar dependencias
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copiar el código fuente
COPY src src

# Construir la aplicación
RUN ./mvnw clean package -DskipTests

# Exponer el puerto
EXPOSE 8080

# Agregar script de espera para la base de datos
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Comando para ejecutar la aplicación CON ESPERA a la base de datos
CMD ["/wait-for-it.sh", "db:3306", "--timeout=60", "--", "java", "-jar", "target/proyecto-0.0.1-SNAPSHOT.jar"]