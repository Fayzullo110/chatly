package com.fyzoo.repository;

import com.fyzoo.model.Message;
import com.fyzoo.model.ChatRoom;
import com.fyzoo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoom(ChatRoom room);
    List<Message> findBySender(User sender);
} 