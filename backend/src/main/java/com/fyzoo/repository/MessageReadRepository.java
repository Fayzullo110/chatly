package com.fyzoo.repository;

import com.fyzoo.model.MessageRead;
import com.fyzoo.model.Message;
import com.fyzoo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MessageReadRepository extends JpaRepository<MessageRead, Long> {
    Optional<MessageRead> findByMessageAndUser(Message message, User user);
    List<MessageRead> findByMessage(Message message);
    List<MessageRead> findByUser(User user);
    List<MessageRead> findByMessageInAndUser(List<Message> messages, User user);
} 