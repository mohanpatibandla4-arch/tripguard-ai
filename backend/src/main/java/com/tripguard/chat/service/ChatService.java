package com.tripguard.chat.service;

import com.tripguard.audit.service.AuditService;
import com.tripguard.chat.dto.ChatMessageDto;
import com.tripguard.chat.dto.ChatReply;
import com.tripguard.chat.dto.ChatRequest;
import com.tripguard.chat.dto.ChatResponse;
import com.tripguard.chat.provider.MockChatProvider;
import com.tripguard.chat.provider.OpenAiChatProvider;
import com.tripguard.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final OpenAiChatProvider openAiChatProvider;
    private final MockChatProvider mockChatProvider;
    private final AuditService auditService;
    private final ExecutorService chatStreamExecutor = Executors.newCachedThreadPool();

    @Transactional
    public ChatResponse chat(User user, ChatRequest request) {
        ChatReply reply = resolveReply(request);
        auditService.log(user.getId(), "CHAT_MESSAGE", "Chat", user.getId().toString(),
                "Chat assistant replied to user message");
        return new ChatResponse(reply.text(), Instant.now(), reply.cards());
    }

    public SseEmitter streamChat(User user, ChatRequest request) {
        SseEmitter emitter = new SseEmitter(120_000L);
        chatStreamExecutor.execute(() -> {
            try {
                ChatReply reply = resolveReply(request);
                streamText(emitter, reply.text());
                if (!reply.cards().isEmpty()) {
                    emitter.send(SseEmitter.event().name("cards").data(reply.cards()));
                }
                emitter.send(SseEmitter.event().name("done").data(""));
                auditService.log(user.getId(), "CHAT_MESSAGE", "Chat", user.getId().toString(),
                        "Chat assistant streamed reply");
                emitter.complete();
            } catch (Exception ex) {
                emitter.completeWithError(ex);
            }
        });
        return emitter;
    }

    private ChatReply resolveReply(ChatRequest request) {
        List<ChatMessageDto> history = request.history() != null
                ? request.history()
                : Collections.emptyList();

        return openAiChatProvider.generateReply(request.message(), history)
                .map(text -> new ChatReply(text))
                .orElseGet(() -> mockChatProvider.generateReply(request.message(), history));
    }

    private void streamText(SseEmitter emitter, String text) throws IOException, InterruptedException {
        String[] tokens = text.split("(?<=\\s)");
        for (String token : tokens) {
            emitter.send(SseEmitter.event().name("token").data(token));
            Thread.sleep(18);
        }
    }
}
