package com.tripguard.chat.service;

import com.tripguard.chat.dto.ChatMessageDto;
import com.tripguard.chat.dto.ChatRequest;
import com.tripguard.chat.provider.MockChatProvider;
import com.tripguard.user.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private com.tripguard.chat.provider.OpenAiChatProvider openAiChatProvider;

    @Mock
    private MockChatProvider mockChatProvider;

    @Mock
    private com.tripguard.audit.service.AuditService auditService;

    @InjectMocks
    private ChatService chatService;

    @Test
    void chat_shouldReturnMockReplyWhenOpenAiUnavailable() {
        User user = User.builder().email("u@example.com").passwordHash("h").fullName("User").build();
        user.setId(UUID.randomUUID());

        when(openAiChatProvider.generateReply(any(), any())).thenReturn(Optional.empty());
        when(mockChatProvider.generateReply(eq("Is my flight delayed?"), any()))
                .thenReturn(new com.tripguard.chat.dto.ChatReply("Check the timeline on your booking page."));

        var response = chatService.chat(user, new ChatRequest(
                "Is my flight delayed?",
                List.of(new ChatMessageDto("user", "Hello"))
        ));

        assertThat(response.reply()).contains("timeline");
        assertThat(response.repliedAt()).isNotNull();
        verify(auditService).log(any(), eq("CHAT_MESSAGE"), eq("Chat"), any(), any());
    }
}
