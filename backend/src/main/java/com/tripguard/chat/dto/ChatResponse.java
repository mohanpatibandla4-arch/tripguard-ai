package com.tripguard.chat.dto;

import java.time.Instant;
import java.util.List;

public record ChatResponse(String reply, Instant repliedAt, List<ChatCardDto> cards) {
}
