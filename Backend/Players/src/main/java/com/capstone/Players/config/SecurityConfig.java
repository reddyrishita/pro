package com.capstone.Players.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;

import com.capstone.Players.service.UserDetailsServiceImpl;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Autowired
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Autowired
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    @Autowired
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, 
                        UserDetailsServiceImpl userDetailsService,
                        CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
        this.userDetailsService = userDetailsService;
    }

    // @Bean
    // public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
    //     return http
    //         .csrf(ServerHttpSecurity.CsrfSpec::disable)
    //         .authorizeExchange(exchanges -> exchanges
    //             .pathMatchers("/api/users/login", "/api/users/createUser", "/api/teams/register/**").permitAll()
    //             .anyExchange().authenticated()
    //         )
    //         .exceptionHandling(handling -> handling
    //             .authenticationEntryPoint(customAuthenticationEntryPoint)
    //         )
    //         .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
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

    @Bean
    public ReactiveAuthenticationManager reactiveAuthenticationManager() {
        UserDetailsRepositoryReactiveAuthenticationManager authManager = 
            new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
        authManager.setPasswordEncoder(passwordEncoder());
        return authManager;
    }
}
