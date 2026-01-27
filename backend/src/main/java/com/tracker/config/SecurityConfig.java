package com.tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        var admin = User.builder()
                .username("admin")
                .password(encoder.encode("password123"))
                .roles("ADMIN")
                .build();

        var client = User.builder()
                .username("client")
                .password(encoder.encode("client123"))
                .roles("CLIENT")
                .build();

        return new InMemoryUserDetailsManager(admin, client);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Login endpoint - public (no auth required)
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        // POST endpoints (start/stop) - ADMIN only
                        .requestMatchers(HttpMethod.POST, "/api/sessions/**").hasRole("ADMIN")
                        // GET endpoints - ADMIN and CLIENT
                        .requestMatchers(HttpMethod.GET, "/api/sessions/**").hasAnyRole("ADMIN", "CLIENT")
                        // Auth /me endpoint - any authenticated user
                        .requestMatchers("/api/auth/me").authenticated()
                        // Everything else requires authentication
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // IMPORTANTE: Não pode usar "*" com allowCredentials(true)
        // Use allowedOriginPatterns para wildcards OU liste as origins específicas
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));

        // Alternativa mais segura (descomente e comente a linha acima):
        // configuration.setAllowedOrigins(Arrays.asList(
        // "https://rastreamento-beta.vercel.app",
        // "http://localhost:5173"
        // ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
