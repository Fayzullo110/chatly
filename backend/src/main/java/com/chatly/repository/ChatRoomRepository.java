package com.chatly.repository;

import com.chatly.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    boolean existsByName(String name);
} 