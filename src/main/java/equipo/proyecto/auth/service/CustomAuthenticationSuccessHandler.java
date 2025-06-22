// filepath: c:\Users\hecto\Desktop\INGENIERIA DE SOFTWARE\PARCIAL PROYECTO 2\github rama 2 - eliminar fav\Proyecto-Final-de-IS\src\main\java\equipo\proyecto\auth\service\CustomAuthenticationSuccessHandler.java
package equipo.proyecto.auth.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        
        System.out.println("DEBUG: Login exitoso para usuario: " + authentication.getName());
        
        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
        
        if (roles.contains("ROLE_ADMINISTRADOR")) {
            System.out.println("DEBUG: Redirigiendo a /admin");
            response.sendRedirect("/admin");
        } else {
            System.out.println("DEBUG: Redirigiendo a /home");
            response.sendRedirect("/home");
        }
    }
}