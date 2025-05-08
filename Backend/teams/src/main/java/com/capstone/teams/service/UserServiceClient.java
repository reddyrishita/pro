package com.capstone.teams.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.capstone.teams.dto.PlayerStatsDTO;

import reactor.core.publisher.Mono;

@Service
public class UserServiceClient {

    private final WebClient webClient;

    public UserServiceClient(@Value("${team.service.url}") String teamServiceUrl, WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(teamServiceUrl).build();
    }

    public Mono<Object> getUserDetails(String userId) {
        return webClient.get()
                .uri("/api/users/userId/{userId}", userId)
                .retrieve()
                .bodyToMono(Object.class);
    }

    public Mono<Void> updateTeam(String userId, String teamId) {
        System.out.println("Attempting to update user " + userId + " with team " + teamId);
        return webClient.put()
                .uri("/api/users/updateTeam/{userId}/{teamId}", userId, teamId)
                .retrieve()
                .onStatus(
                    status -> status.is4xxClientError() || status.is5xxServerError(),
                    response -> response.bodyToMono(String.class)
                        .flatMap(error -> {
                            System.err.println("Error response from user service: " + error);
                            return Mono.error(new RuntimeException("Error updating user team: " + error));
                        })
                )
                .bodyToMono(Void.class)
                .doOnSuccess(v -> System.out.println("Successfully updated team for user " + userId))
                .doOnError(error -> System.err.println("Error updating team: " + error.getMessage()));
    }

    public Mono<PlayerStatsDTO> getCurrentStats(String userId) {
return webClient.get()
.uri("/api/users/stats/{userId}", userId)
.retrieve()
.bodyToMono(PlayerStatsDTO.class);
}

public Mono<PlayerStatsDTO> initializePlayerStats(String userId) {
    PlayerStatsDTO initialStats = new PlayerStatsDTO();
    initialStats.setCurrentScore(0);
    initialStats.setCurrentWickets(0);

    return webClient.put()
            .uri("/api/users/update-stats/{userId}", userId)
            .bodyValue(initialStats)
            .retrieve()
            .bodyToMono(PlayerStatsDTO.class)
            .doOnError(error -> System.err.println("Error initializing stats for user " + userId + ": " + error.getMessage()));
}
}