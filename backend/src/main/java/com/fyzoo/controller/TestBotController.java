package com.fyzoo.controller;

import com.fyzoo.model.Message;
import com.fyzoo.service.TestBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/testbot")
public class TestBotController {
    
    @Autowired
    private TestBotService testBotService;
    
    @PostMapping("/initialize")
    public ResponseEntity<?> initializeBot() {
        testBotService.initializeTestBot();
        return ResponseEntity.ok(Map.of(
            "message", "TestBot initialized successfully",
            "bot", Map.of(
                "username", testBotService.getTestBot().getUsername(),
                "email", testBotService.getTestBot().getEmail()
            )
        ));
    }
    
    @PostMapping("/send/text")
    public ResponseEntity<?> sendTextMessage(@RequestParam(required = false) Long chatRoomId, @RequestParam String message) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendTextMessage(chatRoomId, message);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Text message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send message"));
    }
    
    @PostMapping("/send/random-text")
    public ResponseEntity<?> sendRandomTextMessage(@RequestParam(required = false) Long chatRoomId) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendRandomTextMessage(chatRoomId);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Random text message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send message"));
    }
    
    @PostMapping("/send/image")
    public ResponseEntity<?> sendImageMessage(@RequestParam(required = false) Long chatRoomId, @RequestParam(required = false) String imageName) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendImageMessage(chatRoomId, imageName);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Image message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send image message"));
    }
    
    @PostMapping("/send/video")
    public ResponseEntity<?> sendVideoMessage(@RequestParam(required = false) Long chatRoomId, @RequestParam(required = false) String videoName) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendVideoMessage(chatRoomId, videoName);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Video message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send video message"));
    }
    
    @PostMapping("/send/audio")
    public ResponseEntity<?> sendAudioMessage(@RequestParam(required = false) Long chatRoomId, @RequestParam(required = false) String audioName) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendAudioMessage(chatRoomId, audioName);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Audio message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send audio message"));
    }
    
    @PostMapping("/send/file")
    public ResponseEntity<?> sendFileMessage(@RequestParam(required = false) Long chatRoomId, @RequestParam(required = false) String fileName) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendFileMessage(chatRoomId, fileName);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "File message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send file message"));
    }
    
    @PostMapping("/send/call-started")
    public ResponseEntity<?> sendCallStartedMessage(@RequestParam(required = false) Long chatRoomId) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendCallStartedMessage(chatRoomId);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Call started message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send call message"));
    }
    
    @PostMapping("/send/video-call-started")
    public ResponseEntity<?> sendVideoCallStartedMessage(@RequestParam(required = false) Long chatRoomId) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendVideoCallStartedMessage(chatRoomId);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Video call started message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send video call message"));
    }
    
    @PostMapping("/send/interactive")
    public ResponseEntity<?> sendInteractiveMessage(@RequestParam(required = false) Long chatRoomId) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message sentMessage = testBotService.sendInteractiveMessage(chatRoomId);
        if (sentMessage != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Interactive message sent successfully",
                "sentMessage", sentMessage
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send interactive message"));
    }
    
    @PostMapping("/auto-respond")
    public ResponseEntity<?> autoRespondToMessage(@RequestParam(required = false) Long chatRoomId, @RequestParam String userMessage) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        Message response = testBotService.autoRespondToMessage(chatRoomId, userMessage);
        if (response != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Auto-response sent successfully",
                "response", response
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Failed to send auto-response"));
    }
    
    @PostMapping("/bulk-test")
    public ResponseEntity<?> sendBulkTestMessages(@RequestParam(required = false) Long chatRoomId, @RequestParam(defaultValue = "10") int count) {
        if (chatRoomId == null) chatRoomId = testBotService.getTestBotRoomId();
        if (count > 50) {
            return ResponseEntity.badRequest().body(Map.of("error", "Maximum 50 messages allowed for bulk testing"));
        }
        
        testBotService.sendBulkTestMessages(chatRoomId, count);
        return ResponseEntity.ok(Map.of(
            "message", "Bulk test messages sent successfully",
            "count", count
        ));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getBotStats() {
        String stats = testBotService.getBotStats();
        return ResponseEntity.ok(Map.of(
            "message", "Bot statistics retrieved successfully",
            "stats", stats
        ));
    }
    
    @GetMapping("/commands")
    public ResponseEntity<?> getAvailableCommands() {
        Map<String, Object> commands = new HashMap<>();
        commands.put("message", "Available TestBot Commands");
        
        Map<String, String> commandMap = new HashMap<>();
        commandMap.put("text", "Send a text message");
        commandMap.put("random-text", "Send a random text message");
        commandMap.put("image", "Send an image message");
        commandMap.put("video", "Send a video message");
        commandMap.put("audio", "Send an audio message");
        commandMap.put("file", "Send a file message");
        commandMap.put("call-started", "Simulate call started");
        commandMap.put("video-call-started", "Simulate video call started");
        commandMap.put("interactive", "Send interactive help message");
        commandMap.put("auto-respond", "Auto-respond to user message");
        commandMap.put("bulk-test", "Send multiple test messages");
        commandMap.put("stats", "Get bot statistics");
        commands.put("commands", commandMap);
        
        Map<String, String> usageMap = new HashMap<>();
        usageMap.put("POST /testbot/send/text?chatRoomId=1&message=Hello", "Send text message");
        usageMap.put("POST /testbot/send/image?chatRoomId=1", "Send image message");
        usageMap.put("POST /testbot/auto-respond?chatRoomId=1&userMessage=hello", "Auto-respond to message");
        usageMap.put("POST /testbot/bulk-test?chatRoomId=1&count=5", "Send bulk messages");
        commands.put("usage", usageMap);
        
        return ResponseEntity.ok(commands);
    }
    
    @GetMapping("/info")
    public ResponseEntity<?> getBotInfo() {
        testBotService.initializeTestBot();
        return ResponseEntity.ok(Map.of(
            "botUser", Map.of(
                "id", testBotService.getTestBot().getId(),
                "username", testBotService.getTestBot().getUsername(),
                "email", testBotService.getTestBot().getEmail()
            ),
            "botRoom", Map.of(
                "id", testBotService.getTestBotRoom().getId(),
                "name", testBotService.getTestBotRoom().getName()
            )
        ));
    }
} 