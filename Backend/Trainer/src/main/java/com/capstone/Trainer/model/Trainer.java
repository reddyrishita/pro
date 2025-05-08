package com.capstone.Trainer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "trainers")
public class Trainer {

    @Id
    private String id;
    private String name;
    private String email;
    private String city;
    private String specialization;
    private int experience;

    public Trainer() {}

    public Trainer(String id, String name, String email, String city, String specialization, int experience) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.city = city;
        this.specialization = specialization;
        this.experience = experience;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }
}

