package com.capstone.Trainer.repository;

import com.capstone.Trainer.model.Trainer;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface TrainerRepository extends ReactiveMongoRepository<Trainer, String> {
    Flux<Trainer> findByCity(String city);
}
