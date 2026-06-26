package com.tripguard.chat.dto;

public record ChatCardDto(
        String title,
        String subtitle,
        String imageUrl,
        String actionUrl
) {
}
