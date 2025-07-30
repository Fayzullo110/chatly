package com.fyzoo.controller;

import com.fyzoo.model.Message;
import com.fyzoo.model.ChatRoom;
import com.fyzoo.model.User;
import com.fyzoo.model.MessageRead;
import com.fyzoo.repository.MessageRepository;
import com.fyzoo.repository.ChatRoomRepository;
import com.fyzoo.repository.MessageReadRepository;
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
import java.util.Set;
import com.fyzoo.model.CustomUserDetails;

@RestController
@RequestMapping("/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private MessageReadRepository messageReadRepository;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
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
        return ResponseEntity.ok(new MessageResponse(message.getId(), message.getContent(), message.getCreatedAt(), user.getUsername(), message.getMessageType(), message.getFileUrl(), message.getEditedAt(), message.getReactions()));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("chatRoomId") Long chatRoomId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(new ErrorResponse("Unauthorized"));
        }
        User user = userDetails.getUser();
        // Allowed extensions and MIME types
        String[] allowedExtensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".raw", ".heic", ".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv", ".mp3", ".wav", ".ogg", ".aac", ".flac", ".m4a", ".pdf", ".docx", ".xlsx", ".pptx", ".zip", ".txt"};
        String[] allowedMimeTypes = {"image/", "video/", "audio/", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/zip", "text/plain"};
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("No file uploaded"));
            }
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase() : "";
            String mimeType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";
            boolean validExt = java.util.Arrays.stream(allowedExtensions).anyMatch(fileExtension::equals);
            boolean validMime = java.util.Arrays.stream(allowedMimeTypes).anyMatch(mimeType::startsWith);
            if (!validExt || !validMime) {
                return ResponseEntity.badRequest().body(new ErrorResponse("File type not allowed"));
            }
            // Placeholder for virus scanning (integrate with ClamAV or similar)
            // if (!VirusScanner.isSafe(file)) return ResponseEntity.badRequest().body(new ErrorResponse("File failed virus scan"));
            String uploadDir = "uploads/messages";
            Files.createDirectories(Paths.get(uploadDir));
            String filename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(uploadDir, filename);
            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, filePath);
            }
            // Determine message type based on file extension
            String messageType = "FILE";
            if (fileExtension.matches("\\.mp4|\\.avi|\\.mov|\\.wmv|\\.flv|\\.webm|\\.mkv|\\.4k|\\.hevc|\\.h265$")) {
                messageType = "VIDEO";
            } else if (fileExtension.matches("\\.jpg|\\.jpeg|\\.png|\\.gif|\\.bmp|\\.webp|\\.tiff|\\.raw|\\.heic$")) {
                messageType = "IMAGE";
            } else if (fileExtension.matches("\\.mp3|\\.wav|\\.ogg|\\.aac|\\.flac|\\.m4a$")) {
                messageType = "AUDIO";
            }
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
            return ResponseEntity.ok(new MessageResponse(message.getId(), message.getContent(), message.getCreatedAt(), user.getUsername(), message.getMessageType(), message.getFileUrl(), message.getEditedAt(), message.getReactions()));
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
                .filter(m -> m.getSender() != null)
                .map(m -> new MessageResponse(m.getId(), m.getContent(), m.getCreatedAt(), m.getSender().getUsername(), m.getMessageType(), m.getFileUrl(), m.getEditedAt(), m.getReactions()))
                .toList());
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long messageId, @RequestParam(value = "forAll", defaultValue = "false") boolean forAll, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        Message message = messageRepository.findById(messageId).orElse(null);
        if (message == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Message not found"));
        }
        boolean isSender = message.getSender().getId().equals(user.getId());
        boolean isPrivate = message.getRoom().getType() == com.fyzoo.model.ChatRoom.ChatRoomType.PRIVATE;
        if (forAll && (isSender || isPrivate)) {
            message.setDeletedForAll(true);
            messageRepository.save(message);
            return ResponseEntity.ok().body("Message deleted for everyone");
        } else if (isSender) {
            messageRepository.delete(message);
            return ResponseEntity.ok().body("Message deleted for you");
        } else {
            return ResponseEntity.status(403).body(new ErrorResponse("You can only delete your own messages"));
        }
    }

    @PatchMapping("/{messageId}")
    public ResponseEntity<?> editMessage(@PathVariable Long messageId, @RequestBody EditMessageRequest request, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        Message message = messageRepository.findById(messageId).orElse(null);
        if (message == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Message not found"));
        }
        if (!message.getSender().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(new ErrorResponse("You can only edit your own messages"));
        }
        message.setContent(request.content());
        message.setEditedAt(java.time.LocalDateTime.now());
        messageRepository.save(message);
        return ResponseEntity.ok(new MessageResponse(message.getId(), message.getContent(), message.getCreatedAt(), user.getUsername(), message.getMessageType(), message.getFileUrl(), message.getEditedAt(), message.getReactions()));
    }

    @PostMapping("/{messageId}/reactions")
    public ResponseEntity<?> addReaction(@PathVariable Long messageId, @RequestParam String emoji, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        Message message = messageRepository.findById(messageId).orElse(null);
        if (message == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Message not found"));
        }
        if (message.getReactions() == null) message.setReactions(new java.util.HashMap<>());
        message.getReactions().computeIfAbsent(emoji, k -> new java.util.HashSet<>()).add(user.getId());
        messageRepository.save(message);
        return ResponseEntity.ok(message.getReactions());
    }

    @DeleteMapping("/{messageId}/reactions")
    public ResponseEntity<?> removeReaction(@PathVariable Long messageId, @RequestParam String emoji, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        Message message = messageRepository.findById(messageId).orElse(null);
        if (message == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Message not found"));
        }
        if (message.getReactions() != null && message.getReactions().containsKey(emoji)) {
            Set<Long> users = message.getReactions().get(emoji);
            users.remove(user.getId());
            if (users.isEmpty()) message.getReactions().remove(emoji);
            messageRepository.save(message);
        }
        return ResponseEntity.ok(message.getReactions());
    }

    @PostMapping("/{messageId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long messageId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        Message message = messageRepository.findById(messageId).orElse(null);
        if (message == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Message not found"));
        }
        MessageRead read = messageReadRepository.findByMessageAndUser(message, user).orElse(null);
        if (read == null) {
            read = MessageRead.builder().message(message).user(user).readAt(java.time.LocalDateTime.now()).build();
            messageReadRepository.save(read);
        }
        return ResponseEntity.ok().body("Marked as read");
    }

    @GetMapping("/{messageId}/reads")
    public ResponseEntity<?> getReadStatus(@PathVariable Long messageId) {
        Message message = messageRepository.findById(messageId).orElse(null);
        if (message == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Message not found"));
        }
        var reads = messageReadRepository.findByMessage(message);
        return ResponseEntity.ok(reads.stream().map(r -> new ReadReceiptResponse(r.getUser().getId(), r.getUser().getUsername(), r.getReadAt())).toList());
    }

    public record SendMessageRequest(String content, Long chatRoomId, String messageType, String fileUrl) {}
    public record EditMessageRequest(String content) {}
    public record MessageResponse(Long id, String content, LocalDateTime createdAt, String sender, String messageType, String fileUrl, LocalDateTime editedAt, java.util.Map<String, java.util.Set<Long>> reactions) {}
    public record ErrorResponse(String error) {}
    public record ReadReceiptResponse(Long userId, String username, java.time.LocalDateTime readAt) {}
} 