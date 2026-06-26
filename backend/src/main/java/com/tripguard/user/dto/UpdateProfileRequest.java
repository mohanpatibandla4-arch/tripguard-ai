package com.tripguard.user.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 32) String phoneNumber,
        Boolean emailAlertsEnabled,
        Boolean smsAlertsEnabled
) {
}
