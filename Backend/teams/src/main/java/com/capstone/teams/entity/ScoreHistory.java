package com.capstone.teams.entity;

public class ScoreHistory {
private double overs;
private int score;
private int wickets;
private String commentary;

public ScoreHistory(double overs, int score, int wickets, String commentary) {
    this.overs = overs;
    this.score = score;
    this.wickets = wickets;
    this.commentary = commentary;
}

// Default constructor
public ScoreHistory() {}

// Getters and Setters
public double getOvers() {
    return overs;
}

public void setOvers(double overs) {
    this.overs = overs;
}

public int getScore() {
    return score;
}

public void setScore(int score) {
    this.score = score;
}

public int getWickets() {
    return wickets;
}

public void setWickets(int wickets) {
    this.wickets = wickets;
}

public String getCommentary() {
    return commentary;
}

public void setCommentary(String commentary) {
    this.commentary = commentary;
}
}
