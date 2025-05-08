package com.capstone.Players.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.capstone.Players.dto.BattingStatsDTO;
import com.capstone.Players.dto.BowlingStatsDTO;
import com.capstone.Players.dto.OrganizerDTO;
import com.capstone.Players.dto.PlayerStatsDTO;
import com.capstone.Players.model.User;
import com.capstone.Players.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, PlayerStatsDTO> latestStats = new ConcurrentHashMap<>();

    public Mono<Boolean> authenticate(String username, String password) {
        return userRepository.findByUserName(username)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .defaultIfEmpty(false);
    }

    public Mono<User> createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Mono<User> updateUser(String userId, User user) {
        return userRepository.findById(userId)
                .flatMap(existingUser -> {
                    existingUser.setUserName(user.getUserName());
                    existingUser.setUserEmail(user.getUserEmail());
                    existingUser.setUserTeamId(user.getUserTeamId());
                    existingUser.setTotalScore(user.getTotalScore());
                    existingUser.setTotalWickets(user.getTotalWickets());
                    existingUser.setTotalMatches(user.getTotalMatches());
                    existingUser.setHighestScore(user.getHighestScore());
                    existingUser.setHighestWickets(user.getHighestWickets());
                    existingUser.setNumberOfMatchesOrganized(user.getNumberOfMatchesOrganized());
                    existingUser.setNumberOfSupportStaff(user.getNumberOfSupportStaff());
                    existingUser.setNumberOfSponsors(user.getNumberOfSponsors());
                    return userRepository.save(existingUser);
                });
    }

    public Mono<User> updateTeamId(String userId, String teamId) {
        return userRepository.findById(userId)
                .flatMap(user -> {
                    user.setUserTeamId(teamId);
                    return userRepository.save(user);
                });
    }

    public Mono<User> findByUserEmail(String userEmail) {
        return userRepository.findByUserEmail(userEmail);
    }

    public Mono<PlayerStatsDTO> getPlayerStats(String userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    PlayerStatsDTO kafkaUpdate = latestStats.get(userId);
                    int currentScore = kafkaUpdate != null ? kafkaUpdate.getCurrentScore() : user.getCurrentScore();
                    int currentWickets = kafkaUpdate != null ? kafkaUpdate.getCurrentWickets() : user.getCurrentWickets();

                    return new PlayerStatsDTO(
                            user.getUserId(),
                            user.getUserName(),
                            user.getTotalScore(),
                            user.getTotalWickets(),
                            user.getTotalMatches(),
                            user.getHighestScore(),
                            user.getHighestWickets(),
                            currentScore,
                            currentWickets
                    );
                });
    }

    public Mono<BattingStatsDTO> getBattingStats(String userId) {
        return userRepository.findById(userId)
                .map(user -> new BattingStatsDTO(
                        user.getUserId(),
                        user.getUserName(),
                        user.getTotalScore(),
                        user.getTotalMatches(),
                        user.getHighestScore()
                ));
    }

    public Mono<BowlingStatsDTO> getBowlingStats(String userId) {
        return userRepository.findById(userId)
                .map(user -> new BowlingStatsDTO(
                        user.getUserId(),
                        user.getUserName(),
                        user.getTotalMatches(),
                        user.getTotalWickets(),
                        user.getHighestWickets()
                ));
    }

    public Mono<OrganizerDTO> getOrganizerStats(String userId) {
        return userRepository.findById(userId)
                .map(user -> new OrganizerDTO(
                        user.getUserId(),
                        user.getUserName(),
                        user.getNumberOfMatchesOrganized(),
                        user.getNumberOfSponsors(),
                        user.getNumberOfSupportStaff()
                ));
    }

    public Mono<User> updatePlayerStats(String userId, PlayerStatsDTO playerStatsDTO) {
        return userRepository.findById(userId)
                .flatMap(user -> {
                    user.setTotalScore(playerStatsDTO.getTotalScore());
                    user.setTotalMatches(playerStatsDTO.getTotalMatches());
                    user.setHighestScore(playerStatsDTO.getHighestScore());
                    user.setTotalWickets(playerStatsDTO.getTotalWickets());
                    user.setHighestWickets(playerStatsDTO.getHighestWickets());
                    return userRepository.save(user);
                });
    }

    public Mono<User> findByUserName(String userName) {
        return userRepository.findByUserName(userName);
    }

    public Mono<User> findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    @KafkaListener(topics = "match-score", groupId = "player-scores", containerFactory = "kafkaListenerContainerFactory")
    public void listen(String message) {
        try {
            System.out.println("Received Kafka message: " + message);
            Map<String, Object> messageValue = objectMapper.readValue(message, Map.class);

            String userId = (String) messageValue.get("playerId");
            int runsScored = messageValue.get("runsScored") != null ? Integer.parseInt(messageValue.get("runsScored").toString()) : 0;
            int wicketsTaken = messageValue.get("wicketsTaken") != null ? Integer.parseInt(messageValue.get("wicketsTaken").toString()) : 0;

            if (userId == null) {
                System.out.println("Skipping message with null playerId");
                return;
            }

            userRepository.findById(userId)
                    .flatMap(user -> {
                        user.setCurrentScore(user.getCurrentScore() + runsScored);
                        user.setCurrentWickets(user.getCurrentWickets() + wicketsTaken);
                        user.setTotalScore(user.getTotalScore() + runsScored);
                        user.setTotalWickets(user.getTotalWickets() + wicketsTaken);

                        if (runsScored > user.getHighestScore()) {
                            user.setHighestScore(runsScored);
                        }
                        if (wicketsTaken > user.getHighestWickets()) {
                            user.setHighestWickets(wicketsTaken);
                        }

                        return userRepository.save(user);
                    })
                    .subscribe(
                            savedUser -> System.out.println("Updated user in DB: " + savedUser),
                            error -> System.err.println("Error updating user: " + error.getMessage())
                    );
        } catch (Exception e) {
            System.err.println("Error processing Kafka message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public Mono<List<PlayerStatsDTO>> getAllPlayerStats() {
        return userRepository.findAll()
                .map(user -> new PlayerStatsDTO(
                        user.getUserId(),
                        user.getUserName(),
                        user.getTotalScore(),
                        user.getTotalWickets(),
                        user.getTotalMatches(),
                        user.getHighestScore(),
                        user.getHighestWickets(),
                        user.getCurrentScore(),
                        user.getCurrentWickets()
                ))
                .collectList();
    }

    public Mono<List<PlayerStatsDTO>> getPlayerStatsByUserId(String userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    List<PlayerStatsDTO> allStats = new ArrayList<>();
                    PlayerStatsDTO currentStats = new PlayerStatsDTO(
                            user.getUserId(),
                            user.getUserName(),
                            user.getTotalScore(),
                            user.getTotalWickets(),
                            user.getTotalMatches(),
                            user.getHighestScore(),
                            user.getHighestWickets(),
                            user.getCurrentScore(),
                            user.getCurrentWickets()
                    );
                    allStats.add(currentStats);

                    List<PlayerStatsDTO> latest = latestStats.values().stream()
                            .filter(stat -> stat.getUserId().equals(userId))
                            .collect(Collectors.toList());

                    allStats.addAll(latest);
                    return allStats;
                });
    }

    public Mono<PlayerStatsDTO> savePlayerStats(PlayerStatsDTO playerStatsDTO) {
        return userRepository.findById(playerStatsDTO.getUserId())
                .flatMap(user -> {
                    user.setCurrentScore(playerStatsDTO.getCurrentScore());
                    user.setCurrentWickets(playerStatsDTO.getCurrentWickets());
                    user.setTotalScore(user.getTotalScore() + playerStatsDTO.getCurrentScore());
                    user.setTotalWickets(user.getTotalWickets() + playerStatsDTO.getCurrentWickets());

                    if (playerStatsDTO.getCurrentScore() > user.getHighestScore()) {
                        user.setHighestScore(playerStatsDTO.getCurrentScore());
                    }
                    if (playerStatsDTO.getCurrentWickets() > user.getHighestWickets()) {
                        user.setHighestWickets(playerStatsDTO.getCurrentWickets());
                    }

                    return userRepository.save(user);
                })
                .map(saved -> playerStatsDTO);
    }
}
