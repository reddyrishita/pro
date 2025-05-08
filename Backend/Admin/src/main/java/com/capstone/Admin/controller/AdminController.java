package com.capstone.Admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import com.capstone.Admin.model.Admin;
import com.capstone.Admin.service.AdminService;
import com.capstone.Admin.dto.LoginRequest;
import com.capstone.Admin.dto.SignUpRequest;
import com.capstone.Admin.dto.LoginResponse;
import com.capstone.Admin.service.JwtService;
import com.capstone.Admin.dto.TrainerDTO;
import com.capstone.Admin.dto.UserDTO;
import org.springframework.web.client.HttpClientErrorException;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtService jwtService;

    // Create a new trainer
    @PostMapping("/createTrainer")
    public Mono<TrainerDTO> createTrainer(@RequestBody TrainerDTO trainerDTO) {
        return adminService.createTrainer(trainerDTO)
                .onErrorResume(e -> Mono.error(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Error creating trainer")));
    }

    // View all users
    @GetMapping("/getAllUsers")
    public Mono<UserDTO[]> getAllUsers() {
        return adminService.getAllUsers()
                .onErrorResume(e -> Mono.error(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Error fetching users")));
    }

    // View all trainers
    @GetMapping("/getAllTrainers")
    public Mono<TrainerDTO[]> getAllTrainers() {
        return adminService.getAllTrainers()
                .onErrorResume(e -> Mono.error(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Error fetching trainers")));
    }

    // View trainers by city
    @GetMapping("/getTrainersByCity/{city}")
    public Mono<TrainerDTO[]> getTrainersByCity(@RequestParam String city) {
        return adminService.getTrainersByCity(city)
                .onErrorResume(e -> Mono.error(new HttpClientErrorException(HttpStatus.NOT_FOUND, "Trainers not found in this city")));
    }

    @PostMapping("/createAdmin")
    public Mono<ResponseEntity<Admin>> createAdmin(@RequestBody SignUpRequest signUpRequest) {
        return adminService.createAdmin(signUpRequest)
                .map(admin -> ResponseEntity.ok(admin))
                .onErrorResume(e -> Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(null)));
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<? extends Object>> login(@RequestBody LoginRequest loginRequest) {
        return adminService.findByUserName(loginRequest.getUserName())
                .flatMap(admin -> adminService.authenticate(loginRequest.getUserName(), loginRequest.getPassword())
                        .map(isAuthenticated -> {
                            if (isAuthenticated) {
                                String token = jwtService.generateToken(loginRequest.getUserName());
                                LoginResponse loginResponse = new LoginResponse(token, admin.getUserId());
                                return ResponseEntity.ok(loginResponse);
                            } else {
                                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                            }
                        }))
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null));
    }

    @GetMapping("/{userName}")
    public Mono<ResponseEntity<Admin>> findByUserName(@PathVariable String userName) {
        return adminService.findByUserName(userName)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}

// Add this class for error responses
class ErrorResponse {
    private String message;
    
    public ErrorResponse(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }
}

