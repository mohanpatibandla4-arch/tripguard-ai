package com.tripguard.notification.dto;

public record NotificationConfigResponse(
        boolean emailProviderConfigured,
        boolean smsProviderConfigured,
        boolean whatsAppProviderConfigured
) {
}
