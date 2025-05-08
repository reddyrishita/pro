package com.capstone.Admin.dto;

public class LoginResponse {
    private String token;
    private String id;

    public LoginResponse(String token, String id) {
        this.token = token;
        this.id = id;
    }

    // Getters and setters for all fields

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
