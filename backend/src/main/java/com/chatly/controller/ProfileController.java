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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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

    @PatchMapping
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user, @RequestBody UpdateProfileRequest req) {
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        
        // Validate input
        if (req.username() != null && req.username().isBlank()) {
            return ResponseEntity.badRequest().body("Username cannot be empty");
        }
        if (req.email() != null && req.email().isBlank()) {
            return ResponseEntity.badRequest().body("Email cannot be empty");
        }
        
        // Check if username is already taken by another user (only if username is being changed)
        if (req.username() != null && !req.username().equals(user.getUsername())) {
            if (userRepository.findByUsername(req.username()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already taken");
            }
        }
        
        // Check if email is already taken by another user (only if email is being changed)
        if (req.email() != null && !req.email().equals(user.getEmail())) {
            if (userRepository.findByEmail(req.email()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already taken");
            }
        }
        
        // Update fields (only if they are provided and different)
        boolean hasChanges = false;
        if (req.username() != null && !req.username().isBlank() && !req.username().equals(user.getUsername())) {
            user.setUsername(req.username());
            hasChanges = true;
        }
        if (req.email() != null && !req.email().isBlank() && !req.email().equals(user.getEmail())) {
            user.setEmail(req.email());
            hasChanges = true;
        }
        
        // Save changes only if there are actual changes
        if (hasChanges) {
            userRepository.save(user);
        }
        
        return ResponseEntity.ok(new ProfileResponse(user.getId(), user.getUsername(), user.getEmail(), user.getAvatarUrl()));
    }

    @PatchMapping("/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal User user, @RequestBody ChangePasswordRequest req) {
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        if (req.newPassword() == null || req.newPassword().isBlank()) return ResponseEntity.badRequest().body("New password required");
        user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(req.newPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password changed");
    }

    // For phones/emails, assuming user has List<String> phones/emails (not in current model, so just stubs)
    // Add phone/email endpoints here if needed

    public record ProfileResponse(Long id, String username, String email, String avatarUrl) {}

    public record AvatarResponse(String avatarUrl) {}

    public record UpdateProfileRequest(String username, String email) {}

    public record ChangePasswordRequest(String newPassword) {}
} 