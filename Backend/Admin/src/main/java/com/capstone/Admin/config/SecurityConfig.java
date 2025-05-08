package com.capstone.Admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    // @Bean
    // public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
    //     return http
    //         .csrf(csrf -> csrf.disable())
    //         .httpBasic(httpBasic -> httpBasic.disable())
    //         .formLogin(formLogin -> formLogin.disable())
    //         .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
    //         .authorizeExchange(exchanges -> exchanges
    //             .pathMatchers("/api/admin/login", "/api/admin/createAdmin").permitAll()
    //             .anyExchange().authenticated()
    //         )
    //         .build();
    // }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(auth -> auth
                .anyExchange().permitAll()  // Allow all endpoints
            )
            .build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
