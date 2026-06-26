package com.tripguard.chat.dto;

import java.util.List;

public record ChatReply(String text, List<ChatCardDto> cards) {

    public ChatReply(String text) {
        this(text, List.of());
    }
}
