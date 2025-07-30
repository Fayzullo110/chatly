package com.fyzoo.controller;
import com.fyzoo.model.User;
import com.fyzoo.model.CustomUserDetails;
import com.fyzoo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserResponse> listUsers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        return userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .map(u -> new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getAvatarUrl()))
                .toList();
    }

    public record UserResponse(Long id, String username, String email, String avatarUrl) {}
} 