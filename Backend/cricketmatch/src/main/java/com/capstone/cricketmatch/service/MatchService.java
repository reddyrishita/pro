package com.capstone.cricketmatch.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.capstone.cricketmatch.KafkaProducerConfig.KafkaProducerConfig;
import com.capstone.cricketmatch.entity.Match;
import com.capstone.cricketmatch.entity.PlayerStats;
import com.capstone.cricketmatch.repository.MatchRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MatchService {
    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamServiceClient teamServiceClient;

    @Autowired
    private KafkaTemplate<String, PlayerStats> kafkaTemplate;

    @Autowired
    private KafkaProducerConfig kafkaProducer;

    private static final String TOPIC = "match-score";

    public void updatePlayerStats(String playerId, String teamId, int runsScored, int wicketsTaken, int deliveries) {
        try {
            // Create PlayerStats object
            PlayerStats stats = new PlayerStats(playerId, teamId, runsScored, wicketsTaken, deliveries);

            // Log the stats being sent
            System.out.println("Sending stats to Kafka - Player: " + playerId +
                    ", Runs: " + runsScored +
                    ", Wickets: " + wicketsTaken +
                    ", TeamId:" + teamId +
                    ", Deliveries:" + deliveries);

            // Send to Kafka
            kafkaProducer.sendEntity(TOPIC, stats);

            System.out.println("Successfully sent stats to Kafka for player: " + playerId);

        } catch (Exception e) {
            System.err.println("Error sending stats to Kafka: " + e.getMessage());
            throw new RuntimeException("Failed to update player stats", e);
        }
    }

    public Mono<Match> createMatch(Match match) {
        return matchRepository.save(match)
            .flatMap(savedMatch -> {
                // Call Team Service to create teams
                return teamServiceClient.createTeamsForMatch(
                        savedMatch.getId().toString(),
                        List.of(savedMatch.getTeam1(), savedMatch.getTeam2()),
                        match.getTeamSize()
                ).thenReturn(savedMatch);
            });
    }

    public Flux<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public Mono<Match> getMatchByCode(String code) {
        return matchRepository.findByCode(code);
    }

    // public Flux<Match> getMatchesByDate(Date date){
    //     return matchRepository.findByDate(date);
    // }

    public Flux<Match> getMatchesByLocation(String location) {
        return matchRepository.findByLocation(location);
    }

    public Flux<Match> getMatchesByStatus(String status) {
        return matchRepository.findByStatus(status);
    }

    public Mono<Match> startMatch(Long id) {
        System.out.println("Starting match with ID: " + id);
        return matchRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Match not found with ID: " + id)))
            .flatMap(match -> {
                if (!"Upcoming".equals(match.getStatus())) {
                    return Mono.error(new RuntimeException("Match cannot be started: Invalid status"));
                }
                match.setStatus("Ongoing");
                return matchRepository.save(match)
                    .doOnSuccess(savedMatch -> System.out.println("Match status updated successfully"))
                    .doOnError(error -> System.err.println("Error saving match: " + error.getMessage()));
            });
    }

    public Mono<Match> endMatch(Long id) {
        System.out.println("Ending match with ID: " + id);
        return matchRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Match not found with ID: " + id)))
            .flatMap(match -> {
                if (!"Ongoing".equals(match.getStatus())) {
                    return Mono.error(new RuntimeException("Match cannot be ended: Invalid status"));
                }
                match.setStatus("Completed");
                return calculateAndUpdateWinner(match)
                    .flatMap(updatedMatch -> matchRepository.save(updatedMatch))
                    .doOnSuccess(savedMatch -> System.out.println("Match ended and winner updated successfully"))
                    .doOnError(error -> System.err.println("Error ending match: " + error.getMessage()));
            });
    }

    private Mono<Match> calculateAndUpdateWinner(Match match) {
        return teamServiceClient.getTeamScores(match.getId().toString())
            .collectList()
            .map(scores -> {
                if (scores.size() != 2) {
                    throw new RuntimeException("Expected scores for both teams");
                }
                
                int teamAScore = 0;
                int teamBScore = 0;
                
                for (var score : scores) {
                    if (score.getTeamName().equals(match.getTeam1())) {
                        teamAScore = score.getTeamScore();
                    } else if (score.getTeamName().equals(match.getTeam2())) {
                        teamBScore = score.getTeamScore();
                    }
                }
                
                if (teamAScore > teamBScore) {
                    match.setWinner(match.getTeam1());
                } else if (teamBScore > teamAScore) {
                    match.setWinner(match.getTeam2());
                } else {
                    match.setWinner("Tie");
                }
                
                return match;
            });
    }

    public Flux<Match> getMatchByUserId(String userId) {
        return matchRepository.findByUserId(userId);
    }
}
