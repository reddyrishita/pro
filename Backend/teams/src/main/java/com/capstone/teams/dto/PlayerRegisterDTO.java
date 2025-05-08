package com.capstone.teams.dto;

import java.util.List;

public class PlayerRegisterDTO {

    private String matchId;
    private String userId;
    private String teamName;
    private String userName;
    private List<String> positions;

    // Add getters
    public String getMatchId() {
        return matchId;
    }

    public String getUserId() {
        return userId;
    }

    public String getTeamName() {
        return teamName;
    }

    public String getUserName() {
        return userName;
    }

    public List<String> getPositions() {
        return positions;
    }

    // Optionally add setters or use @Data from Lombok
}
