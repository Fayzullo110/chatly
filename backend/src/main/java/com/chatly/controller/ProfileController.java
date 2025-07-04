package com.chatly.controller;

import com.chatly.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import com.chatly.repository.UserRepository;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        // Return only safe fields
        return ResponseEntity.ok(new ProfileResponse(user.getId(), user.getUsername(), user.getEmail(), user.getAvatarUrl()));
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }
        try {
            // Save file to local uploads/avatars directory
            String uploadDir = "uploads/avatars";
            Files.createDirectories(Paths.get(uploadDir));
            String ext = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".") ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')) : "";
            String filename = UUID.randomUUID() + ext;
            Path filePath = Paths.get(uploadDir, filename);
            file.transferTo(filePath);
            // Update user avatarUrl
            user.setAvatarUrl("/" + uploadDir + "/" + filename);
            userRepository.save(user);
            return ResponseEntity.ok().body(new AvatarResponse(user.getAvatarUrl()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload avatar");
        }
    }

    public record ProfileResponse(Long id, String username, String email, String avatarUrl) {}

    public record AvatarResponse(String avatarUrl) {}
} 