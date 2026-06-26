package com.tripguard.notification.provider;

import com.tripguard.common.enums.NotificationChannel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class MockNotificationProvider {

    public NotificationSendResult send(NotificationChannel channel, String recipient, String subject, String message) {
        log.info("[MOCK {}] to={} subject={} message={}", channel, recipient, subject, message);
        return NotificationSendResult.ok(
                "mock",
                "mock-" + channel.name().toLowerCase() + "-" + System.currentTimeMillis());
    }
}
