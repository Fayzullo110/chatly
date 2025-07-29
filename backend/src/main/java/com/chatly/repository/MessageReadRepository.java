package com.chatly.repository;

import com.chatly.model.MessageRead;
import com.chatly.model.Message;
import com.chatly.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MessageReadRepository extends JpaRepository<MessageRead, Long> {
    Optional<MessageRead> findByMessageAndUser(Message message, User user);
    List<MessageRead> findByMessage(Message message);
    List<MessageRead> findByUser(User user);
    List<MessageRead> findByMessageInAndUser(List<Message> messages, User user);
} 