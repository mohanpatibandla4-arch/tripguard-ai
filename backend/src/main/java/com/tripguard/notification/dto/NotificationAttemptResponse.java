package com.tripguard.notification.dto;

import com.tripguard.common.enums.NotificationChannel;
import com.tripguard.common.enums.NotificationStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class NotificationAttemptResponse {

    UUID id;
    UUID bookingId;
    NotificationChannel channel;
    NotificationStatus status;
    String recipient;
    String subject;
    String message;
    Instant attemptedAt;
    String errorMessage;
}
