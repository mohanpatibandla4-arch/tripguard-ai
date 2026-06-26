package com.tripguard.notification.dto;

public record TestAlertResponse(
        String message,
        boolean emailSent,
        boolean smsSent,
        String emailDetail,
        String smsDetail
) {
}
