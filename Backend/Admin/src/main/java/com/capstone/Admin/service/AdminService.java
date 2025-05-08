package com.capstone.Admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.capstone.Admin.dto.SignUpRequest;
import com.capstone.Admin.dto.TrainerDTO;
import com.capstone.Admin.dto.UserDTO;
import com.capstone.Admin.model.Admin;
import com.capstone.Admin.repository.AdminRepository;

import reactor.core.publisher.Mono;

@Service
public class AdminService {

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Autowired
    private AdminRepository adminRepository;

    private final String trainerServiceUrl = "http://localhost:8085/api/trainers";

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final String userServiceUrl = "http://localhost:8082/api/users";

    public Mono<Admin> findByUserName(String userName) {
        return adminRepository.findByUserName(userName);
    }

    public Mono<Boolean> authenticate(String userName, String password) {
        return findByUserName(userName)
            .map(admin -> passwordEncoder.matches(password, admin.getPassword()))
            .defaultIfEmpty(false);
    }

    public Mono<Admin> createAdmin(SignUpRequest signUpRequest) {
        return adminRepository.findByUserName(signUpRequest.getUserName())
            .flatMap(existingAdmin -> Mono.<Admin>error(new RuntimeException("Username already exists")))
            .switchIfEmpty(Mono.defer(() -> {
                Admin newAdmin = new Admin();
                newAdmin.setUserName(signUpRequest.getUserName());
                newAdmin.setUserEmail(signUpRequest.getUserEmail());
                newAdmin.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
                return adminRepository.save(newAdmin);
            }));
    }

    // Create a new trainer
    public Mono<TrainerDTO> createTrainer(TrainerDTO trainerDTO) {
        // Create WebClient instance from the builder
        WebClient webClient = webClientBuilder.baseUrl(trainerServiceUrl).build();

        // Use the post method on the WebClient instance
        return webClient.post()
                .bodyValue(trainerDTO)  // Send trainerDTO as request body
                .retrieve()  // Retrieve the response
                .bodyToMono(TrainerDTO.class);  // Convert response to TrainerDTO
    }

    // Get all users
    public Mono<UserDTO[]> getAllUsers() {
        // Create WebClient instance
        WebClient webClient = webClientBuilder.baseUrl(userServiceUrl).build();

        return webClient.get()  // Use the GET method on the WebClient instance
                .retrieve()  // Retrieve the response
                .bodyToMono(UserDTO[].class);  // Convert response to an array of UserDTO
    }

    // Get all trainers
    public Mono<TrainerDTO[]> getAllTrainers() {
        // Create WebClient instance
        WebClient webClient = webClientBuilder.baseUrl(trainerServiceUrl).build();

        return webClient.get()  // Use the GET method on the WebClient instance
                .retrieve()  // Retrieve the response
                .bodyToMono(TrainerDTO[].class);  // Convert response to an array of TrainerDTO
    }


    // Get trainers by city
    public Mono<TrainerDTO[]> getTrainersByCity(String city) {
        // Create WebClient instance
        WebClient webClient = webClientBuilder.baseUrl(trainerServiceUrl).build();

        return webClient.get()  // Use the GET method
                .uri("/search?city={city}", city)  // Pass the city as a parameter
                .retrieve()  // Retrieve the response
                .bodyToMono(TrainerDTO[].class);  // Convert response to an array of TrainerDTO
    }
}
