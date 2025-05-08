package com.capstone.Admin.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import com.capstone.Admin.model.Admin;
import reactor.core.publisher.Mono;

@Repository
public interface AdminRepository extends ReactiveMongoRepository<Admin, String> {
    Mono<Admin> findByUserName(String userName);
    Mono<Admin> findByUserEmail(String userEmail);
}
