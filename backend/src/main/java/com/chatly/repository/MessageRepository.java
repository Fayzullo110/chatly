package com.chatly.repository;

import com.chatly.model.Message;
import com.chatly.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoom(ChatRoom room);
} 