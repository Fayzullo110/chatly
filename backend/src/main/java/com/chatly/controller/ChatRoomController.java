package com.chatly.controller;

import com.chatly.model.ChatRoom;
import com.chatly.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/rooms")
public class ChatRoomController {
    @Autowired
    private ChatRoomRepository chatRoomRepository;

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

    public record CreateRoomRequest(String name) {}
    public record RoomResponse(Long id, String name, LocalDateTime createdAt) {}
    public record ErrorResponse(String error) {}
} 