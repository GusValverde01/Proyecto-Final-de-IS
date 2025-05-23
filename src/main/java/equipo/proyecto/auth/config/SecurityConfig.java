package equipo.proyecto.auth.config;

import equipo.proyecto.auth.service.CustomAuthenticationSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/admin").hasRole("ADMINISTRADOR")
                .requestMatchers("/home").authenticated()
                .requestMatchers("/home", "/favoritos/**").authenticated() // Protegemos las rutas de favoritos
                .anyRequest().permitAll())
            .formLogin((form) -> form
                .loginPage("/login")
                .successHandler(new CustomAuthenticationSuccessHandler()) // Aquí usamos el handler personalizado
                .permitAll())
            .logout((logout) -> logout.permitAll());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
