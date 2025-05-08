package com.capstone.teams.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.teams.dto.PlayerRegisterDTO;
import com.capstone.teams.dto.TeamCreationRequest;
import com.capstone.teams.dto.TeamScoreDTO;
import com.capstone.teams.entity.ScoreHistory;
import com.capstone.teams.entity.Team;
import com.capstone.teams.service.TeamService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    
    @Autowired
    private TeamService teamService;
    
    @PostMapping("/create-for-match")
    public Mono<Void> createTeamsForMatch(@RequestBody TeamCreationRequest request) {
        return teamService.createTeamsForMatch(request.getMatchId(), request.getTeamNames(), request.getTeamSize());
    }


    @PostMapping("/register")
    public Mono<Team> registerUser(@RequestBody PlayerRegisterDTO playerRegisterDTO) {
        System.out.println("Received registration request: " + playerRegisterDTO);
        return teamService.registerUser(
            playerRegisterDTO.getMatchId(), 
            playerRegisterDTO.getUserId(), 
            playerRegisterDTO.getTeamName(),
            playerRegisterDTO.getUserName(),
            playerRegisterDTO.getPositions()
        );
    }

    @GetMapping("/matchStats/{matchId}")
    public Flux<Team> getMatchStats(@PathVariable String matchId) {
        return teamService.getMatchStats(matchId);
    }



    @GetMapping("/{matchId}")
    public Flux<Team> getTeamDetails(@PathVariable String matchId) {
        return teamService.getTeamDetails(matchId);
    }

    @GetMapping("/{matchId}/{teamName}/score")
public Mono<TeamScoreDTO> getTeamScore(
@PathVariable String matchId,
@PathVariable String teamName) {
return teamService.getTeamScore(matchId, teamName);
}

// Optional: Add endpoint to view player stats in a team
@GetMapping("/{matchId}/{teamName}/player-stats")
public Mono<Map<String, List<Integer>>> getTeamPlayerStats(
        @PathVariable String matchId,
        @PathVariable String teamName) {
    return teamService.getTeamDetails(matchId)
            .filter(team -> team.getTeamName().equals(teamName))
            .next()
            .map(team -> team.getTeam());
}
@GetMapping("/team/score-history/{matchId}/{teamName}")
public Mono<List<ScoreHistory>> getTeamScoreHistory(
        @PathVariable String matchId,
        @PathVariable String teamName
) {
    return teamService.getTeamScoreHistory(matchId, teamName);
}

@GetMapping("/registeredPlayers/{matchId}")
public Flux<Team> getRegisteredPlayers(@PathVariable String matchId) {
    return teamService.getRegisteredPlayers(matchId);
}



}
