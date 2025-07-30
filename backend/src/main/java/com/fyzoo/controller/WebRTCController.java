package com.fyzoo.controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebRTCController {

    @MessageMapping("/call.offer")
    @SendTo("/topic/call")
    public Map<String, Object> handleOffer(@Payload Map<String, Object> offer, SimpMessageHeaderAccessor headerAccessor) {
        return offer;
    }

    @MessageMapping("/call.answer")
    @SendTo("/topic/call")
    public Map<String, Object> handleAnswer(@Payload Map<String, Object> answer, SimpMessageHeaderAccessor headerAccessor) {
        return answer;
    }

    @MessageMapping("/call.ice-candidate")
    @SendTo("/topic/call")
    public Map<String, Object> handleIceCandidate(@Payload Map<String, Object> candidate, SimpMessageHeaderAccessor headerAccessor) {
        return candidate;
    }

    @MessageMapping("/call.end")
    @SendTo("/topic/call")
    public Map<String, Object> handleCallEnd(@Payload Map<String, Object> endCall, SimpMessageHeaderAccessor headerAccessor) {
        return endCall;
    }
} 