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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request, @AuthenticationPrincipal User user) {
        ChatRoom room = chatRoomRepository.findById(request.chatRoomId()).orElse(null);
        if (room == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        }
        Message message = Message.builder()
                .content(request.content())
                .messageType(request.messageType() != null ? request.messageType() : "TEXT")
                .fileUrl(request.fileUrl())
                .createdAt(LocalDateTime.now())
                .sender(user)
                .room(room)
                .build();
        messageRepository.save(message);
        return ResponseEntity.ok(new MessageResponse(message.getId(), message.getContent(), message.getCreatedAt(), user.getUsername(), message.getMessageType(), message.getFileUrl()));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("chatRoomId") Long chatRoomId, @AuthenticationPrincipal User user) {
        try {
            // Create uploads directory if it doesn't exist
            String uploadDir = "uploads/messages";
            Files.createDirectories(Paths.get(uploadDir));

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(uploadDir, filename);

            // Save file
            Files.copy(file.getInputStream(), filePath);

            // Determine message type based on file extension
            String messageType = "FILE";
            if (fileExtension != null) {
                String lowerExt = fileExtension.toLowerCase();
                if (lowerExt.matches("\\.(mp4|avi|mov|wmv|flv|webm)$")) {
                    messageType = "VIDEO";
                } else if (lowerExt.matches("\\.(jpg|jpeg|png|gif|bmp|webp)$")) {
                    messageType = "IMAGE";
                } else if (lowerExt.matches("\\.(mp3|wav|ogg|aac|flac)$")) {
                    messageType = "AUDIO";
                }
            }

            // Create message with file
            ChatRoom room = chatRoomRepository.findById(chatRoomId).orElse(null);
            if (room == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
            }

            Message message = Message.builder()
                    .content(originalFilename)
                    .messageType(messageType)
                    .fileUrl("/uploads/messages/" + filename)
                    .createdAt(LocalDateTime.now())
                    .sender(user)
                    .room(room)
                    .build();
            messageRepository.save(message);

            return ResponseEntity.ok(new MessageResponse(message.getId(), message.getContent(), message.getCreatedAt(), user.getUsername(), message.getMessageType(), message.getFileUrl()));

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> listMessages(@RequestParam Long chatRoomId) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (room == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Room not found"));
        }
        List<Message> messages = messageRepository.findByRoom(room);
        return ResponseEntity.ok(messages.stream()
                .map(m -> new MessageResponse(m.getId(), m.getContent(), m.getCreatedAt(), m.getSender().getUsername(), m.getMessageType(), m.getFileUrl()))
                .toList());
    }

    public record SendMessageRequest(String content, Long chatRoomId, String messageType, String fileUrl) {}
    public record MessageResponse(Long id, String content, LocalDateTime createdAt, String sender, String messageType, String fileUrl) {}
    public record ErrorResponse(String error) {}
} 