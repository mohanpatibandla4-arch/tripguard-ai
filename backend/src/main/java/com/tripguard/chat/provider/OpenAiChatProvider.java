package com.tripguard.chat.provider;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tripguard.chat.config.OpenAiProperties;
import com.tripguard.chat.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class OpenAiChatProvider {

    private static final String SYSTEM_PROMPT = """
            You are TripGuard AI — a real-time travel assistant (like Perplexity + Intercom for flights).
            Help with: live flight tracking, route planning, delays, cancellations, airport codes, and booking setup.
            For route questions, suggest connecting airports (e.g. VGA→HYD→HEL) and tell users to add a booking in TripGuard to track status.
            Be concise, structured, and actionable. Use short paragraphs and bullet points when helpful.
            If you lack live inventory, be honest and guide users to Add booking + Track status.
            """;

    private final OpenAiProperties properties;
    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.openai.com")
            .build();

    public Optional<String> generateReply(String message, List<ChatMessageDto> history) {
        if (!properties.isEnabled() || !StringUtils.hasText(properties.getApiKey())) {
            return Optional.empty();
        }

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
        if (history != null) {
            for (ChatMessageDto item : history) {
                messages.add(Map.of("role", item.role(), "content", item.content()));
            }
        }
        messages.add(Map.of("role", "user", "content", message));

        try {
            OpenAiResponse response = restClient.post()
                    .uri("/v1/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + properties.getApiKey())
                    .body(Map.of(
                            "model", properties.getModel(),
                            "messages", messages,
                            "temperature", 0.7,
                            "max_tokens", 500
                    ))
                    .retrieve()
                    .body(OpenAiResponse.class);

            if (response == null || response.choices == null || response.choices.isEmpty()) {
                return Optional.empty();
            }
            String content = response.choices.get(0).message().content();
            return StringUtils.hasText(content) ? Optional.of(content.trim()) : Optional.empty();
        } catch (RestClientException ex) {
            log.warn("OpenAI chat failed, falling back to mock: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenAiResponse(List<Choice> choices) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Choice(OpenAiMessage message) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenAiMessage(String role, String content) {
    }
}
