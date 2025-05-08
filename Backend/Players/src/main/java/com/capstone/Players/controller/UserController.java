package com.capstone.Players.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.Players.dto.BattingStatsDTO;
import com.capstone.Players.dto.BowlingStatsDTO;
import com.capstone.Players.dto.LoginRequest;
import com.capstone.Players.dto.LoginResponse;
import com.capstone.Players.dto.OrganizerDTO;
import com.capstone.Players.dto.PlayerStatsDTO;
import com.capstone.Players.model.User;
import com.capstone.Players.service.JwtService;
import com.capstone.Players.service.UserService;

import reactor.core.publisher.Mono;

// @CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;
    // Create a new user
    @PostMapping("/createUser")
    public Mono<User> createUser(@RequestBody User user) {
        return userService.createUser(user);
    }


    @PutMapping("/updateUser/{userId}")
    public Mono<User> updateUser(@PathVariable String userId, @RequestBody User user) {
        return userService.updateUser(userId, user);
    }

    @GetMapping("/userId/{userId}")
    public Mono<User> findByUserId(@PathVariable String userId) {
        return userService.findByUserId(userId);
    }

    @GetMapping("/userName/{userName}")
    public Mono<User> findByUserName(@PathVariable String userName) {
        return userService.findByUserName(userName);
    }

    // Get user by email
    @GetMapping("/email/{userEmail}")
    public Mono<User> findByUserEmail(@PathVariable String userEmail) {
        return userService.findByUserEmail(userEmail);
    }


    // Get player stats
    @GetMapping("/stats/{userId}")
    public Mono<PlayerStatsDTO> getPlayerStats(@PathVariable String userId) {
        return userService.getPlayerStats(userId);
    }

    // Fetch Batting Stats
    @GetMapping("/battingStats/{userId}")
    public Mono<BattingStatsDTO> getBattingStats(@PathVariable String userId) {
        return userService.getBattingStats(userId);
    }

    // Fetch Bowling Stats
    @GetMapping("/bowlingStats/{userId}")
    public Mono<BowlingStatsDTO> getBowlingStats(@PathVariable String userId) {
        return userService.getBowlingStats(userId);
    }

    // Update player stats
    @PutMapping("/updateStats/{userId}")
    public Mono<ResponseEntity<User>> updatePlayerStats(
            @PathVariable String userId,
            @RequestBody PlayerStatsDTO playerStatsDTO) {

        return userService.updatePlayerStats(userId, playerStatsDTO)
                .map(user -> ResponseEntity.ok(user))
                .switchIfEmpty(Mono.just(ResponseEntity.notFound().build()));
    }

    @PutMapping("/updateTeam/{userId}/{teamId}")
    public Mono<User> updateTeamId(@PathVariable String userId, @PathVariable String teamId) {
        return userService.updateTeamId(userId, teamId);
    }

    @GetMapping("/stats")
public Mono<ResponseEntity<List<PlayerStatsDTO>>> getAllPlayerStats() {
return userService.getAllPlayerStats()
.map(ResponseEntity::ok)
.defaultIfEmpty(ResponseEntity.notFound().build());
}


    @PostMapping("/login")
    public Mono<ResponseEntity<? extends Object>> login(@RequestBody LoginRequest loginDTO) {
        return userService.findByUserName(loginDTO.getUserName())
            .flatMap(user -> userService.authenticate(loginDTO.getUserName(), loginDTO.getPassword())
                .map(isAuthenticated -> {
                    if (isAuthenticated) {
                        String token = jwtService.generateToken(loginDTO.getUserName());
                        LoginResponse loginResponse = new LoginResponse(token, user.getUserId());
                        return ResponseEntity.ok(loginResponse);
                    } else {
                        return ResponseEntity.status(401).body(null);
                    }
                }))
            .defaultIfEmpty(ResponseEntity.status(401).body(null));
    }

    @GetMapping("/getOrganizerStats/{userId}")
    public Mono<OrganizerDTO> getOrganizerStats(@PathVariable String userId) {
        return userService.getOrganizerStats(userId);
    }

}
