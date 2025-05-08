package com.capstone.Admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.capstone.Admin.repository.AdminRepository;

import reactor.core.publisher.Mono;

@Service
public class UserDetailsServiceImpl implements ReactiveUserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return adminRepository.findByUserName(username)
            .switchIfEmpty(Mono.error(new UsernameNotFoundException("User not found")))
            .map(user -> org.springframework.security.core.userdetails.User.builder()
                .username(user.getUserName())
                .password(user.getPassword())
                .build());
    }
}