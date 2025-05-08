package com.capstone.Admin.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.capstone.Admin.service.JwtService;
import com.capstone.Admin.service.UserDetailsServiceImpl;

import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @SuppressWarnings("null")
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String authHeader = exchange.getRequest()
            .getHeaders()
            .getFirst("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            String username = jwtService.extractUserName(jwt);

            if (username != null) {
                return userDetailsService.findByUsername(username)
                    .filter(userDetails -> jwtService.validateToken(jwt, userDetails.getUsername()))
                    .map(userDetails -> {
                        UsernamePasswordAuthenticationToken auth = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails, 
                                null, 
                                userDetails.getAuthorities()
                            );
                        exchange.getAttributes().put(
                            SecurityContext.class.getName(), 
                            new SecurityContextImpl(auth)
                        );
                        return auth;
                    })
                    .then(chain.filter(exchange))
                    .onErrorResume(e -> chain.filter(exchange));
            }
        }
        return chain.filter(exchange);
    }
}
