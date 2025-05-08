package com.capstone.Trainer.controller;


import com.capstone.Trainer.model.Trainer;
import com.capstone.Trainer.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/trainers")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @PostMapping("/createTrainer")
    public Mono<Trainer> addTrainer(@RequestBody Trainer trainer) {
        return trainerService.addTrainer(trainer);
    }

    @GetMapping("/getAllTrainers")
    public Flux<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    @GetMapping("/search")
    public Flux<Trainer> getTrainersByCity(@RequestParam String city) {
        return trainerService.getTrainersByCity(city);
    }
}
