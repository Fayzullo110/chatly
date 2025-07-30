package com.fyzoo.repository;

import com.fyzoo.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    boolean existsByName(String name);
} 