package com.tripguard.user.dto;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        String phoneNumber,
        String timezone,
        boolean emailAlertsEnabled,
        boolean smsAlertsEnabled
) {
}
