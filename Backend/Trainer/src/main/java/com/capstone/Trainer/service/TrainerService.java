package com.capstone.Trainer.service;

import com.capstone.Trainer.model.Trainer;
import com.capstone.Trainer.repository.TrainerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    public Mono<Trainer> addTrainer(Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    public Flux<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    public Flux<Trainer> getTrainersByCity(String city) {
        return trainerRepository.findByCity(city);
    }
}

