package com.fyzoo.controller;

import com.fyzoo.model.ChatRoom;
import com.fyzoo.model.User;
import com.fyzoo.repository.ChatRoomRepository;
import com.fyzoo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.Optional;

import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fyzoo.model.CustomUserDetails;

@RestController
@RequestMapping("/chatrooms")
public class ChatRoomController {
    private static final Logger logger = LoggerFactory.getLogger(ChatRoomController.class);
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody CreateRoomRequest request) {
        if (chatRoomRepository.existsByName(request.name())) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Room already exists"));
        }
        ChatRoom room = ChatRoom.builder()
                .name(request.name())
                .createdAt(LocalDateTime.now())
                .build();
        chatRoomRepository.save(room);
        return ResponseEntity.ok(new RoomResponse(room.getId(), room.getName(), room.getCreatedAt(), room.getAvatarUrl()));
    }

    @GetMapping
    public List<RoomResponse> listRooms() {
        return chatRoomRepository.findAll().stream()
                .map(r -> new RoomResponse(r.getId(), r.getName(), r.getCreatedAt(), r.getAvatarUrl()))
                .toList();
    }

    @PostMapping("/private")
    public ResponseEntity<?> getOrCreatePrivateRoom(@RequestBody PrivateRoomRequest request, @org.springframework.security.core.annotation.AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        logger.info("[PRIVATE] Request to create private room: currentUser={}, targetUserId={}", currentUser.getId(), request.userId());
        if (request.userId() == null) {
            logger.warn("[PRIVATE] userId is null");
            return ResponseEntity.badRequest().body(new ErrorResponse("userId is required"));
        }
        if (request.userId().equals(currentUser.getId())) {
            // Saved Messages: private room with only yourself
            for (var room : chatRoomRepository.findAll()) {
                if (room.getType() == com.fyzoo.model.ChatRoom.ChatRoomType.PRIVATE &&
                    room.getMembers().size() == 1 &&
                    room.getMembers().contains(currentUser)) {
                    logger.info("[PRIVATE] Found existing self-chat room: {}", room.getId());
                    return ResponseEntity.ok(new RoomResponse(room.getId(), room.getName(), room.getCreatedAt(), room.getAvatarUrl()));
                }
            }
            String roomName = currentUser.getUsername() + "_self";
            var newRoom = com.fyzoo.model.ChatRoom.builder()
                .name(roomName)
                .type(com.fyzoo.model.ChatRoom.ChatRoomType.PRIVATE)
                .createdAt(java.time.LocalDateTime.now())
                .members(new java.util.HashSet<>(java.util.List.of(currentUser)))
                .build();
            chatRoomRepository.save(newRoom);
            logger.info("[PRIVATE] Created new self-chat room: {} with member: {}", newRoom.getId(), currentUser.getId());
            return ResponseEntity.ok(new RoomResponse(newRoom.getId(), newRoom.getName(), newRoom.getCreatedAt(), newRoom.getAvatarUrl()));
        }
        User otherUser = userRepository.findById(request.userId()).orElse(null);
        if (otherUser == null) {
            logger.warn("[PRIVATE] User not found: {}", request.userId());
            return ResponseEntity.badRequest().body(new ErrorResponse("User not found"));
        }
        // Find existing private room with exactly these two members
        for (var room : chatRoomRepository.findAll()) {
            if (room.getType() == com.fyzoo.model.ChatRoom.ChatRoomType.PRIVATE &&
                room.getMembers().size() == 2 &&
                room.getMembers().contains(currentUser) &&
                room.getMembers().contains(otherUser)) {
                logger.info("[PRIVATE] Found existing private room: {}", room.getId());
                return ResponseEntity.ok(new RoomResponse(room.getId(), room.getName(), room.getCreatedAt(), room.getAvatarUrl()));
            }
        }
        // Create new private room
        String roomName = currentUser.getUsername() + "_" + otherUser.getUsername();
        var newRoom = com.fyzoo.model.ChatRoom.builder()
            .name(roomName)
            .type(com.fyzoo.model.ChatRoom.ChatRoomType.PRIVATE)
            .createdAt(java.time.LocalDateTime.now())
            .members(new java.util.HashSet<>(java.util.List.of(currentUser, otherUser)))
            .build();
        chatRoomRepository.save(newRoom);
        logger.info("[PRIVATE] Created new private room: {} with members: {}", newRoom.getId(), newRoom.getMembers().stream().map(User::getId).toList());
        return ResponseEntity.ok(new RoomResponse(newRoom.getId(), newRoom.getName(), newRoom.getCreatedAt(), newRoom.getAvatarUrl()));
    }

    @PostMapping("/group")
    public ResponseEntity<?> createGroupRoom(
            @RequestParam("name") String name,
            @RequestParam(value = "userIds", required = false) java.util.List<String> userIdStrings,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @org.springframework.security.core.annotation.AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        logger.info("[GROUP] Request to create group: name={}, userIdStrings={}, currentUser={}", name, userIdStrings, currentUser.getId());
        try {
            if (name == null || name.isBlank()) {
                logger.warn("[GROUP] Group name is blank");
                return ResponseEntity.badRequest().body(new ErrorResponse("Group name is required"));
            }
            if (chatRoomRepository.existsByName(name)) {
                logger.warn("[GROUP] Group name already exists: {}", name);
                return ResponseEntity.badRequest().body(new ErrorResponse("Group name already exists"));
            }
            if (userIdStrings == null) {
                userIdStrings = new java.util.ArrayList<>();
            }
            logger.info("[GROUP] Raw userIdStrings received: {}", userIdStrings);
            var members = new java.util.HashSet<User>();
            for (String userIdString : userIdStrings) {
                if (userIdString == null || userIdString.trim().isEmpty()) continue;
                try {
                    Long userId = Long.parseLong(userIdString.trim());
                    userRepository.findById(userId).ifPresentOrElse(
                        members::add,
                        () -> logger.warn("[GROUP] User ID not found: {}", userId)
                    );
                } catch (NumberFormatException e) {
                    logger.warn("[GROUP] Invalid user ID format: {}", userIdString);
                }
            }
            members.add(currentUser); // Always add the creator
            logger.info("[GROUP] Final group members: {}", members.stream().map(User::getId).toList());
            // Note: members should never be empty since currentUser is always added
            if (members.isEmpty()) {
                logger.error("[GROUP] No valid members found for group creation - this should not happen");
                return ResponseEntity.badRequest().body(new ErrorResponse("No valid members found for group creation"));
            }
            String avatarUrl = null;
            if (avatar != null && !avatar.isEmpty()) {
                String[] allowedExtensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"};
                String[] allowedMimeTypes = {"image/jpeg", "image/png", "image/gif", "image/webp"};
                String originalFilename = avatar.getOriginalFilename();
                String fileExtension = originalFilename != null && originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase() : "";
                String mimeType = avatar.getContentType() != null ? avatar.getContentType().toLowerCase() : "";
                boolean validExt = java.util.Arrays.stream(allowedExtensions).anyMatch(fileExtension::equals);
                boolean validMime = java.util.Arrays.stream(allowedMimeTypes).anyMatch(mimeType::equals);
                if (!validExt || !validMime) {
                    return ResponseEntity.badRequest().body(new ErrorResponse("File type not allowed"));
                }
                // Placeholder for virus scanning (integrate with ClamAV or similar)
                // if (!VirusScanner.isSafe(avatar)) return ResponseEntity.badRequest().body(new ErrorResponse("File failed virus scan"));
                try {
                    String uploadDir = "uploads/avatars";
                    Files.createDirectories(Paths.get(uploadDir));
                    String filename = UUID.randomUUID() + fileExtension;
                    Path filePath = Paths.get(uploadDir, filename);
                    avatar.transferTo(filePath);
                    avatarUrl = "/" + uploadDir + "/" + filename;
                } catch (Exception e) {
                    e.printStackTrace();
                    logger.error("[GROUP] Failed to upload avatar: {}", e.getMessage());
                    return ResponseEntity.status(500).body(new ErrorResponse("Failed to upload avatar"));
                }
            }
            var newRoom = com.fyzoo.model.ChatRoom.builder()
                .name(name)
                .type(com.fyzoo.model.ChatRoom.ChatRoomType.GROUP)
                .createdAt(java.time.LocalDateTime.now())
                .members(members)
                .avatarUrl(avatarUrl)
                .build();
            chatRoomRepository.save(newRoom);
            logger.info("[GROUP] Created new group room: {} with members: {}", newRoom.getId(), newRoom.getMembers().stream().map(User::getId).toList());
            return ResponseEntity.ok(new RoomResponse(newRoom.getId(), newRoom.getName(), newRoom.getCreatedAt(), newRoom.getAvatarUrl()));
        } catch (Exception ex) {
            logger.error("[GROUP] Exception during group creation: {}", ex.getMessage(), ex);
            return ResponseEntity.status(500).body(new ErrorResponse("Internal server error: " + ex.getMessage()));
        }
    }

    // DEBUG: Temporary endpoint to echo back received parameters for group creation
    @PostMapping("/group/debug")
    public ResponseEntity<?> debugGroupCreation(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "userIds", required = false) java.util.List<String> userIds,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        String avatarInfo = (avatar != null) ? (avatar.getOriginalFilename() + ", size=" + avatar.getSize()) : "none";
        return ResponseEntity.ok(java.util.Map.of(
            "name", name,
            "userIds", userIds,
            "avatar", avatarInfo
        ));
    }

    @PatchMapping("/{roomId}")
    public ResponseEntity<?> updateGroupRoom(
            @PathVariable Long roomId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @AuthenticationPrincipal User currentUser) {
        Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
        if (roomOpt.isEmpty()) return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        ChatRoom room = roomOpt.get();
        if (room.getType() != ChatRoom.ChatRoomType.GROUP) return ResponseEntity.badRequest().body(new ErrorResponse("Not a group chat"));
        // Only allow group members to edit (optionally restrict to creator/admin)
        if (!room.getMembers().contains(currentUser)) return ResponseEntity.status(403).body(new ErrorResponse("Forbidden"));
        if (name != null && !name.isBlank()) room.setName(name);
        if (avatar != null && !avatar.isEmpty()) {
            try {
                String uploadDir = "uploads/avatars";
                Files.createDirectories(Paths.get(uploadDir));
                String ext = avatar.getOriginalFilename() != null && avatar.getOriginalFilename().contains(".") ? avatar.getOriginalFilename().substring(avatar.getOriginalFilename().lastIndexOf('.')) : "";
                String filename = UUID.randomUUID() + ext;
                Path filePath = Paths.get(uploadDir, filename);
                avatar.transferTo(filePath);
                room.setAvatarUrl("/" + uploadDir + "/" + filename);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(new ErrorResponse("Failed to upload avatar"));
            }
        }
        chatRoomRepository.save(room);
        return ResponseEntity.ok(new RoomResponse(room.getId(), room.getName(), room.getCreatedAt(), room.getAvatarUrl()));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteGroupRoom(@PathVariable Long roomId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
        if (roomOpt.isEmpty()) return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        ChatRoom room = roomOpt.get();
        // Only allow group creator to delete (optionally add admin logic)
        if (!room.getMembers().contains(currentUser)) return ResponseEntity.status(403).body(new ErrorResponse("Forbidden"));
        chatRoomRepository.delete(room);
        return ResponseEntity.ok().body("Group deleted");
    }

    @GetMapping("/{roomId}/invite-link")
    public ResponseEntity<?> getInviteLink(@PathVariable Long roomId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
        if (roomOpt.isEmpty()) return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        ChatRoom room = roomOpt.get();
        if (!room.isPublic()) return ResponseEntity.badRequest().body(new ErrorResponse("Not a public group"));
        // Generate a simple invite link (could be more secure)
        String link = "http://localhost:3000/join/" + room.getId();
        return ResponseEntity.ok().body(link);
    }

    @PostMapping("/{roomId}/invite")
    public ResponseEntity<?> inviteUsersToPrivateGroup(@PathVariable Long roomId, @RequestParam("userIds") java.util.List<Long> userIds, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
        if (roomOpt.isEmpty()) return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        ChatRoom room = roomOpt.get();
        if (room.isPublic()) return ResponseEntity.badRequest().body(new ErrorResponse("Not a private group"));
        if (!room.getMembers().contains(currentUser)) return ResponseEntity.status(403).body(new ErrorResponse("Forbidden"));
        for (Long userId : userIds) {
            userRepository.findById(userId).ifPresent(room.getMembers()::add);
        }
        chatRoomRepository.save(room);
        return ResponseEntity.ok().body("Users invited");
    }

    @GetMapping("/{roomId}/members")
    public ResponseEntity<?> getRoomMembers(@PathVariable Long roomId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User currentUser = userDetails.getUser();
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if (room == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        }
        if (!room.getMembers().contains(currentUser)) {
            return ResponseEntity.status(403).body(new ErrorResponse("Forbidden"));
        }
        return ResponseEntity.ok(
            room.getMembers().stream()
                .map(u -> new MemberResponse(u.getId(), u.getUsername(), u.getAvatarUrl()))
                .toList()
        );
    }

    public record CreateRoomRequest(String name) {}
    public record RoomResponse(Long id, String name, LocalDateTime createdAt, String avatarUrl) {}
    public record ErrorResponse(String error) {}
    public record PrivateRoomRequest(Long userId) {}
    public record GroupRoomRequest(String name, java.util.List<Long> userIds) {}
    public record MemberResponse(Long id, String username, String avatarUrl) {}
} 