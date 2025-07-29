package com.chatly.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.chatly.model.User;
import com.chatly.model.CustomUserDetails;

@RestController
public class TestController {
    @GetMapping("/protected")
    public Object protectedEndpoint(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return org.springframework.http.ResponseEntity.status(401).body("Unauthorized");
        var user = userDetails.getUser();
        return java.util.Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail()
        );
    }
} 