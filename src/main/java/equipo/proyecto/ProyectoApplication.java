package equipo.proyecto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {
    "equipo.proyecto.auth.config",
    "equipo.proyecto.auth.controller",
    "equipo.proyecto.auth.entity",
    "equipo.proyecto.auth.repository",
    "equipo.proyecto.auth.service",
    "equipo.proyecto.auth.SistemaAutenticacion"
})
@EnableJpaRepositories(basePackages = "equipo.proyecto.auth.repository")
@EntityScan(basePackages = "equipo.proyecto.auth.entity")
public class ProyectoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProyectoApplication.class, args);
	}
}
