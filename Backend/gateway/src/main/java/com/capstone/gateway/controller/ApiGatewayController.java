package com.capstone.gateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.bind.annotation.RequestMethod;

import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:4200", 
    allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class ApiGatewayController {

    @Autowired
    private WebClient.Builder webClientBuilder;

    @RequestMapping("/{service}/**")
    public Mono<ResponseEntity<Object>> handleRequest(
            @PathVariable String service,
            @RequestBody(required = false) String body,
            ServerWebExchange exchange) {

        String method = exchange.getRequest().getMethod().name(); // Updated here
        String remainingPath = extractRemainingPath(exchange, service);

        return proxyRequest(service, method, remainingPath, body, exchange);
    }

    private Mono<ResponseEntity<Object>> proxyRequest(String service, String method, String remainingPath, String body, ServerWebExchange exchange) {
        String baseUrl = resolveServiceUrl(service);
    
        if (baseUrl == null) {
            return Mono.just(ResponseEntity.badRequest().body("Invalid service name: " + service));
        }
    
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();
        
        // Build URI with query parameters
        String fullPath = "/api/" + service + remainingPath;
        
        return webClient
            .method(resolveHttpMethod(method))
            .uri(uriBuilder -> {
                uriBuilder.path(fullPath);
                // Add all query parameters from the original request
                exchange.getRequest().getQueryParams().forEach((key, values) -> {
                    values.forEach(value -> uriBuilder.queryParam(key, value));
                });
                return uriBuilder.build();
            })
            .headers(headers -> headers.addAll(exchange.getRequest().getHeaders()))
            .bodyValue(body != null ? body : "")
            .retrieve()
            .bodyToMono(Object.class)
            .map(ResponseEntity::ok)
            .onErrorResume(error -> {
                System.err.println("Error in gateway: " + error.getMessage());
                error.printStackTrace();
                return Mono.just(ResponseEntity.status(500).body("Error: " + error.getMessage()));
            });
    }
    
    

    private String resolveServiceUrl(String service) {
        switch (service.toLowerCase()) {
            case "matches":
                return "http://localhost:8080";
            case "teams":
                return "http://localhost:8081";
            case "users":
                return "http://localhost:8082";
            case "trainer":
                return "http://localhost:8083";
            case "admin":
                return "http://localhost:8084";
            default:
                return null;
        }
    }

    private org.springframework.http.HttpMethod resolveHttpMethod(String method) {
        return org.springframework.http.HttpMethod.valueOf(method.toUpperCase());
    }

    private String extractRemainingPath(ServerWebExchange exchange, String service) {
        String fullPath = exchange.getRequest().getPath().pathWithinApplication().value();
        String servicePath = "/api/" + service;
        return fullPath.substring(servicePath.length()); // This will keep the remaining path after /api/service
    }
}







// @RestController
// @RequestMapping("/api")
// public class ApiGatewayController {

//     @Autowired
//     private WebClient.Builder webClientBuilder;

//     @RequestMapping("/{service}/**")
//     public Mono<ResponseEntity<Object>> handleRequest(
//             @PathVariable String service,
//             @RequestBody(required = false) String body,
//             ServerWebExchange exchange) {

//         String method = exchange.getRequest().getMethod().name();
//         String remainingPath = extractRemainingPath(exchange, service);

//         logRequest(service, method, remainingPath, body);

//         return proxyRequest(service, method, remainingPath, body, exchange);
//     }

//     private Mono<ResponseEntity<Object>> proxyRequest(String service, String method, String remainingPath, String body, ServerWebExchange exchange) {
//         String baseUrl = resolveServiceUrl(service);

//         if (baseUrl == null) {
//             return Mono.just(ResponseEntity.badRequest().body("Invalid service name: " + service));
//         }

//         WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

//         WebClient.RequestBodySpec request = webClient
//                 .method(resolveHttpMethod(method))
//                 .uri(uriBuilder -> {
//                     uriBuilder.path(remainingPath);
//                     exchange.getRequest().getQueryParams().forEach(uriBuilder::queryParam);
//                     return uriBuilder.build();
//                 })
//                 .headers(headers -> headers.addAll(exchange.getRequest().getHeaders()));

//         if (body != null) {
//             request.bodyValue(body);
//         }

//         return request
//                 .retrieve()
//                 .onStatus(status -> status.is4xxClientError(), response -> 
//                     Mono.error(new RuntimeException("Client error: " + response.statusCode())))
//                 .onStatus(status -> status.is5xxServerError(), response -> 
//                     Mono.error(new RuntimeException("Server error: " + response.statusCode())))
//                 .bodyToMono(Object.class)
//                 .map(ResponseEntity::ok)
//                 .onErrorResume(error -> Mono.just(ResponseEntity.status(500).body("Error: " + error.getMessage())));
//     }

//     private String resolveServiceUrl(String service) {
//         switch (service.toLowerCase()) {
//             case "matches":
//                 return "http://localhost:8080";
//             case "teams":
//                 return "http://localhost:8081";
//             case "users":
//                 return "http://localhost:8082";
//             case "trainer":
//                 return "http://localhost:8083";
//             case "admin":
//                 return "http://localhost:8084";
//             default:
//                 return null;
//         }
//     }

//     private org.springframework.http.HttpMethod resolveHttpMethod(String method) {
//         return org.springframework.http.HttpMethod.valueOf(method.toUpperCase());
//     }

//     private String extractRemainingPath(ServerWebExchange exchange, String service) {
//         String fullPath = exchange.getRequest().getPath().pathWithinApplication().value();
//         String servicePath = "/api/" + service;
//         return fullPath.substring(servicePath.length());
//     }

//     private void logRequest(String service, String method, String remainingPath, String body) {
//         System.out.println("Forwarding " + method + " request to service: " + service);
//         System.out.println("Path: " + remainingPath);
//         System.out.println("Body: " + body);
//     }
// }
