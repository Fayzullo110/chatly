package com.chatly.controller;

import com.chatly.model.Message;
import com.chatly.model.ChatRoom;
import com.chatly.model.User;
import com.chatly.repository.MessageRepository;
import com.chatly.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/rooms/{roomId}/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @PostMapping
    public ResponseEntity<?> sendMessage(@PathVariable Long roomId, @RequestBody SendMessageRequest request, @AuthenticationPrincipal User user) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if (room == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        }
        Message message = Message.builder()
                .content(request.content())
                .createdAt(LocalDateTime.now())
                .sender(user)
                .room(room)
                .build();
        messageRepository.save(message);
        return ResponseEntity.ok(new MessageResponse(message.getId(), message.getContent(), message.getCreatedAt(), user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<?> listMessages(@PathVariable Long roomId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if (room == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        }
        List<Message> messages = messageRepository.findByRoom(room);
        return ResponseEntity.ok(messages.stream()
                .map(m -> new MessageResponse(m.getId(), m.getContent(), m.getCreatedAt(), m.getSender().getUsername()))
                .toList());
    }

    public record SendMessageRequest(String content) {}
    public record MessageResponse(Long id, String content, LocalDateTime createdAt, String sender) {}
    public record ErrorResponse(String error) {}
} 