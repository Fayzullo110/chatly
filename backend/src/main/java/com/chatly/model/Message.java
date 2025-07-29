package com.chatly.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private ChatRoom room;

    @Column(name = "message_type")
    private String messageType = "TEXT"; // TEXT, IMAGE, VIDEO, AUDIO, FILE

    @Column(name = "file_url")
    private String fileUrl;

    private boolean deletedForAll = false;

    private LocalDateTime editedAt;

    @Column(columnDefinition = "json")
    @Convert(converter = com.chatly.util.JsonMapConverter.class)
    private Map<String, java.util.Set<Long>> reactions; // emoji -> set of userIds
} 