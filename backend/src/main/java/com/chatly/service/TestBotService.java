package com.chatly.service;

import com.chatly.model.ChatRoom;
import com.chatly.model.Message;
import com.chatly.model.User;
import com.chatly.repository.ChatRoomRepository;
import com.chatly.repository.MessageRepository;
import com.chatly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class TestBotService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private final Random random = new Random();
    
    // Test bot user
    private User testBot;
    // Default TestBot chat room
    private ChatRoom testBotRoom;
    
    public void initializeTestBot() {
        // Create or get test bot user
        Optional<User> existingBot = userRepository.findByEmail("testbot@chatly.com");
        if (existingBot.isPresent()) {
            testBot = existingBot.get();
        } else {
            testBot = User.builder()
                    .username("TestBot")
                    .email("testbot@chatly.com")
                    .password("botpassword123")
                    .createdAt(LocalDateTime.now())
                    .build();
            testBot = userRepository.save(testBot);
        }
        // Create or get default TestBot chat room
        Optional<ChatRoom> existingRoom = chatRoomRepository.findAll().stream()
                .filter(r -> "TestBot Room".equals(r.getName()))
                .findFirst();
        if (existingRoom.isPresent()) {
            testBotRoom = existingRoom.get();
        } else {
            testBotRoom = ChatRoom.builder()
                    .name("TestBot Room")
                    .type(ChatRoom.ChatRoomType.GROUP)
                    .createdAt(LocalDateTime.now())
                    .build();
            testBotRoom = chatRoomRepository.save(testBotRoom);
        }
    }
    
    public User getTestBot() {
        if (testBot == null) {
            initializeTestBot();
        }
        return testBot;
    }
    
    public ChatRoom getTestBotRoom() {
        if (testBotRoom == null) {
            initializeTestBot();
        }
        return testBotRoom;
    }
    
    public Long getTestBotRoomId() {
        return getTestBotRoom().getId();
    }
    
    // Text Messages
    public Message sendTextMessage(Long chatRoomId, String content) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (room == null) return null;
        
        Message message = Message.builder()
                .content(content)
                .messageType("TEXT")
                .createdAt(LocalDateTime.now())
                .sender(testBot)
                .room(room)
                .build();
        
        return messageRepository.save(message);
    }
    
    public Message sendRandomTextMessage(Long chatRoomId) {
        String[] messages = {
            "Hello! I'm TestBot 🤖",
            "How are you doing today?",
            "This is a test message from the bot!",
            "Testing the chat functionality...",
            "Did you know I can send different types of messages?",
            "Let me show you what I can do!",
            "Testing emojis: 😀 🎉 🚀 💻",
            "This is a longer message to test how the chat handles multiple lines and different message lengths. It should wrap properly and look good in the interface.",
            "Random fact: The first computer bug was an actual bug! 🐛",
            "Testing special characters: @#$%^&*()_+-=[]{}|;':\",./<>?"
        };
        
        String randomMessage = messages[random.nextInt(messages.length)];
        return sendTextMessage(chatRoomId, randomMessage);
    }
    
    // Image Messages
    public Message sendImageMessage(Long chatRoomId, String imageName) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (room == null) return null;
        
        String[] sampleImages = {
            "/uploads/messages/sample-image-1.jpg",
            "/uploads/messages/sample-image-2.png",
            "/uploads/messages/sample-image-3.gif",
            "/uploads/messages/sample-image-4.webp"
        };
        
        String imageUrl = imageName != null ? imageName : sampleImages[random.nextInt(sampleImages.length)];
        
        Message message = Message.builder()
                .content("Sample Image " + (random.nextInt(100) + 1))
                .messageType("IMAGE")
                .fileUrl(imageUrl)
                .createdAt(LocalDateTime.now())
                .sender(testBot)
                .room(room)
                .build();
        
        return messageRepository.save(message);
    }
    
    // Video Messages
    public Message sendVideoMessage(Long chatRoomId, String videoName) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (room == null) return null;
        
        String[] sampleVideos = {
            "/uploads/messages/sample-video-1.mp4",
            "/uploads/messages/sample-video-2.avi",
            "/uploads/messages/sample-video-3.mov",
            "/uploads/messages/sample-video-4.webm"
        };
        
        String videoUrl = videoName != null ? videoName : sampleVideos[random.nextInt(sampleVideos.length)];
        
        Message message = Message.builder()
                .content("Sample Video " + (random.nextInt(100) + 1))
                .messageType("VIDEO")
                .fileUrl(videoUrl)
                .createdAt(LocalDateTime.now())
                .sender(testBot)
                .room(room)
                .build();
        
        return messageRepository.save(message);
    }
    
    // Audio Messages
    public Message sendAudioMessage(Long chatRoomId, String audioName) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (room == null) return null;
        
        String[] sampleAudios = {
            "/uploads/messages/sample-audio-1.mp3",
            "/uploads/messages/sample-audio-2.wav",
            "/uploads/messages/sample-audio-3.ogg",
            "/uploads/messages/sample-audio-4.aac"
        };
        
        String audioUrl = audioName != null ? audioName : sampleAudios[random.nextInt(sampleAudios.length)];
        
        Message message = Message.builder()
                .content("Voice Message " + (random.nextInt(100) + 1))
                .messageType("AUDIO")
                .fileUrl(audioUrl)
                .createdAt(LocalDateTime.now())
                .sender(testBot)
                .room(room)
                .build();
        
        return messageRepository.save(message);
    }
    
    // File Messages
    public Message sendFileMessage(Long chatRoomId, String fileName) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (room == null) return null;
        
        String[] sampleFiles = {
            "/uploads/messages/document-1.pdf",
            "/uploads/messages/spreadsheet-1.xlsx",
            "/uploads/messages/presentation-1.pptx",
            "/uploads/messages/text-file-1.txt",
            "/uploads/messages/archive-1.zip"
        };
        
        String fileUrl = fileName != null ? fileName : sampleFiles[random.nextInt(sampleFiles.length)];
        
        Message message = Message.builder()
                .content("Document " + (random.nextInt(100) + 1))
                .messageType("FILE")
                .fileUrl(fileUrl)
                .createdAt(LocalDateTime.now())
                .sender(testBot)
                .room(room)
                .build();
        
        return messageRepository.save(message);
    }
    
    // Call Simulation Messages
    public Message sendCallStartedMessage(Long chatRoomId) {
        return sendTextMessage(chatRoomId, "📞 TestBot started a call with you");
    }
    
    public Message sendCallEndedMessage(Long chatRoomId) {
        return sendTextMessage(chatRoomId, "📞 TestBot ended the call");
    }
    
    public Message sendVideoCallStartedMessage(Long chatRoomId) {
        return sendTextMessage(chatRoomId, "📹 TestBot started a video call with you");
    }
    
    public Message sendVideoCallEndedMessage(Long chatRoomId) {
        return sendTextMessage(chatRoomId, "📹 TestBot ended the video call");
    }
    
    // Interactive Messages
    public Message sendInteractiveMessage(Long chatRoomId) {
        String[] interactiveMessages = {
            "🤖 I can help you test different features! Try:\n• Sending me a message\n• Uploading a file\n• Starting a call\n• Sending an image",
            "🎯 Test Commands:\n• Type 'send image' - I'll send you a sample image\n• Type 'send video' - I'll send you a sample video\n• Type 'send audio' - I'll send you a voice message\n• Type 'send file' - I'll send you a document",
            "📱 Available Features:\n✅ Text messages\n✅ Image sharing\n✅ Video sharing\n✅ Audio messages\n✅ File uploads\n✅ Voice calls\n✅ Video calls\n✅ Real-time chat",
            "🧪 Testing Mode Active!\nI'm here to help you test all the chat features. Just interact with me and I'll respond accordingly!"
        };
        
        String message = interactiveMessages[random.nextInt(interactiveMessages.length)];
        return sendTextMessage(chatRoomId, message);
    }
    
    // Auto-Response to User Messages
    public Message autoRespondToMessage(Long chatRoomId, String userMessage) {
        String lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.contains("hello") || lowerMessage.contains("hi")) {
            return sendTextMessage(chatRoomId, "Hello! 👋 I'm TestBot, ready to help you test the chat features!");
        }
        
        if (lowerMessage.contains("send image")) {
            return sendImageMessage(chatRoomId, null);
        }
        
        if (lowerMessage.contains("send video")) {
            return sendVideoMessage(chatRoomId, null);
        }
        
        if (lowerMessage.contains("send audio") || lowerMessage.contains("voice message")) {
            return sendAudioMessage(chatRoomId, null);
        }
        
        if (lowerMessage.contains("send file") || lowerMessage.contains("document")) {
            return sendFileMessage(chatRoomId, null);
        }
        
        if (lowerMessage.contains("call")) {
            return sendCallStartedMessage(chatRoomId);
        }
        
        if (lowerMessage.contains("video call")) {
            return sendVideoCallStartedMessage(chatRoomId);
        }
        
        if (lowerMessage.contains("help")) {
            return sendInteractiveMessage(chatRoomId);
        }
        
        // Default response
        String[] responses = {
            "I received your message: \"" + userMessage + "\"",
            "Thanks for the message! I'm here to help you test.",
            "Got it! Let me know if you need help testing any features.",
            "Message received! Try asking me to 'send image', 'send video', or 'help'"
        };
        
        return sendTextMessage(chatRoomId, responses[random.nextInt(responses.length)]);
    }
    
    // Bulk Testing
    public void sendBulkTestMessages(Long chatRoomId, int count) {
        for (int i = 0; i < count; i++) {
            int messageType = random.nextInt(5);
            
            switch (messageType) {
                case 0:
                    sendRandomTextMessage(chatRoomId);
                    break;
                case 1:
                    sendImageMessage(chatRoomId, null);
                    break;
                case 2:
                    sendVideoMessage(chatRoomId, null);
                    break;
                case 3:
                    sendAudioMessage(chatRoomId, null);
                    break;
                case 4:
                    sendFileMessage(chatRoomId, null);
                    break;
            }
            
            // Small delay between messages
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
    
    // Get bot statistics
    public String getBotStats() {
        List<Message> botMessages = messageRepository.findBySender(testBot);
        
        long textCount = botMessages.stream().filter(m -> "TEXT".equals(m.getMessageType())).count();
        long imageCount = botMessages.stream().filter(m -> "IMAGE".equals(m.getMessageType())).count();
        long videoCount = botMessages.stream().filter(m -> "VIDEO".equals(m.getMessageType())).count();
        long audioCount = botMessages.stream().filter(m -> "AUDIO".equals(m.getMessageType())).count();
        long fileCount = botMessages.stream().filter(m -> "FILE".equals(m.getMessageType())).count();
        
        return String.format(
            "🤖 TestBot Statistics:\n" +
            "📊 Total Messages: %d\n" +
            "💬 Text Messages: %d\n" +
            "🖼️ Image Messages: %d\n" +
            "🎥 Video Messages: %d\n" +
            "🎵 Audio Messages: %d\n" +
            "📁 File Messages: %d",
            botMessages.size(), textCount, imageCount, videoCount, audioCount, fileCount
        );
    }
} 