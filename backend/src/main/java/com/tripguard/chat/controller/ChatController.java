package com.tripguard.chat.controller;

import com.tripguard.chat.dto.ChatRequest;
import com.tripguard.chat.dto.ChatResponse;
import com.tripguard.chat.service.ChatService;
import com.tripguard.common.security.SecurityUtils;
import com.tripguard.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Tag(name = "Chat")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {

    private final ChatService chatService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @Operation(summary = "Send a message to the TripGuard travel assistant")
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        User user = securityUtils.getCurrentUser();
        return chatService.chat(user, request);
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream assistant reply (Perplexity-style token events)")
    public SseEmitter stream(@Valid @RequestBody ChatRequest request) {
        User user = securityUtils.getCurrentUser();
        return chatService.streamChat(user, request);
    }
}
