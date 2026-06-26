package com.tripguard.notification.provider;

import com.tripguard.common.enums.NotificationChannel;
import lombok.Builder;

@Builder
public record NotificationSendResult(
        boolean success,
        String providerReference,
        String errorMessage,
        String provider
) {
    public static NotificationSendResult ok(String provider, String reference) {
        return new NotificationSendResult(true, reference, null, provider);
    }

    public static NotificationSendResult fail(String provider, String error) {
        return new NotificationSendResult(false, null, error, provider);
    }
}
