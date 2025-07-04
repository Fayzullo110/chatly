package com.chatly.controller;

import com.chatly.model.ChatRoom;
import com.chatly.model.User;
import com.chatly.repository.ChatRoomRepository;
import com.chatly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/rooms")
public class ChatRoomController {
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
        return ResponseEntity.ok(new RoomResponse(room.getId(), room.getName(), room.getCreatedAt()));
    }

    @GetMapping
    public List<RoomResponse> listRooms() {
        return chatRoomRepository.findAll().stream()
                .map(r -> new RoomResponse(r.getId(), r.getName(), r.getCreatedAt()))
                .toList();
    }

    @PostMapping("/private")
    public ResponseEntity<?> getOrCreatePrivateRoom(@RequestBody PrivateRoomRequest request, @org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser) {
        if (request.userId() == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("userId is required"));
        }
        User otherUser = userRepository.findById(request.userId()).orElse(null);
        if (otherUser == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("User not found"));
        }
        // Find existing private room with exactly these two members
        for (var room : chatRoomRepository.findAll()) {
            if (room.getType() == com.chatly.model.ChatRoom.ChatRoomType.PRIVATE &&
                room.getMembers().size() == 2 &&
                room.getMembers().contains(currentUser) &&
                room.getMembers().contains(otherUser)) {
                return ResponseEntity.ok(new RoomResponse(room.getId(), room.getName(), room.getCreatedAt()));
            }
        }
        // Create new private room
        String roomName = currentUser.getUsername() + "_" + otherUser.getUsername();
        var newRoom = com.chatly.model.ChatRoom.builder()
            .name(roomName)
            .type(com.chatly.model.ChatRoom.ChatRoomType.PRIVATE)
            .createdAt(java.time.LocalDateTime.now())
            .members(new java.util.HashSet<>(java.util.List.of(currentUser, otherUser)))
            .build();
        chatRoomRepository.save(newRoom);
        return ResponseEntity.ok(new RoomResponse(newRoom.getId(), newRoom.getName(), newRoom.getCreatedAt()));
    }

    @PostMapping("/group")
    public ResponseEntity<?> createGroupRoom(@RequestBody GroupRoomRequest request, @org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser) {
        if (request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Group name is required"));
        }
        if (request.userIds() == null || request.userIds().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("At least one user must be selected"));
        }
        var members = new java.util.HashSet<User>();
        for (Long userId : request.userIds()) {
            userRepository.findById(userId).ifPresent(members::add);
        }
        members.add(currentUser); // Always add the creator
        var newRoom = com.chatly.model.ChatRoom.builder()
            .name(request.name())
            .type(com.chatly.model.ChatRoom.ChatRoomType.GROUP)
            .createdAt(java.time.LocalDateTime.now())
            .members(members)
            .build();
        chatRoomRepository.save(newRoom);
        return ResponseEntity.ok(new RoomResponse(newRoom.getId(), newRoom.getName(), newRoom.getCreatedAt()));
    }

    @GetMapping("/{roomId}/members")
    public ResponseEntity<?> getRoomMembers(@PathVariable Long roomId, @AuthenticationPrincipal User currentUser) {
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
    public record RoomResponse(Long id, String name, LocalDateTime createdAt) {}
    public record ErrorResponse(String error) {}
    public record PrivateRoomRequest(Long userId) {}
    public record GroupRoomRequest(String name, java.util.List<Long> userIds) {}
    public record MemberResponse(Long id, String username, String avatarUrl) {}
} 