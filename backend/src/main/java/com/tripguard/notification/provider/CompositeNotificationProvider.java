package com.tripguard.notification.provider;

import com.tripguard.common.enums.NotificationChannel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompositeNotificationProvider {

    private final SmtpEmailNotificationProvider smtpEmailNotificationProvider;
    private final TwilioSmsNotificationProvider twilioSmsNotificationProvider;
    private final MockNotificationProvider mockNotificationProvider;

    public NotificationSendResult send(NotificationChannel channel, String recipient,
                                       String subject, String message) {
        if (channel == NotificationChannel.EMAIL) {
            return resolveWithMock(
                    smtpEmailNotificationProvider.send(recipient, subject, message),
                    channel, recipient, subject, message);
        }
        if (channel == NotificationChannel.SMS) {
            return resolveWithMock(
                    twilioSmsNotificationProvider.send(recipient, subject, message),
                    channel, recipient, subject, message);
        }
        return mockNotificationProvider.send(channel, recipient, subject, message);
    }

    private NotificationSendResult resolveWithMock(Optional<NotificationSendResult> real,
                                                   NotificationChannel channel,
                                                   String recipient,
                                                   String subject,
                                                   String message) {
        if (real.isPresent() && real.get().success()) {
            return real.get();
        }
        if (real.isPresent()) {
            log.warn("{} provider failed ({}), using mock fallback",
                    channel, real.get().errorMessage());
        }
        return mockNotificationProvider.send(channel, recipient, subject, message);
    }
}
