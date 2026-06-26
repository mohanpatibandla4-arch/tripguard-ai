package com.tripguard.notification.service;

import com.tripguard.audit.service.AuditService;
import com.tripguard.booking.entity.Booking;
import com.tripguard.common.enums.NotificationChannel;
import com.tripguard.common.enums.NotificationStatus;
import com.tripguard.common.exception.ApiException;
import com.tripguard.flightstatus.entity.FlightStatusEvent;
import com.tripguard.notification.dto.NotificationAttemptResponse;
import com.tripguard.notification.dto.TestAlertResponse;
import com.tripguard.notification.entity.NotificationAttempt;
import com.tripguard.notification.provider.CompositeNotificationProvider;
import com.tripguard.notification.provider.NotificationSendResult;
import com.tripguard.notification.repository.NotificationAttemptRepository;
import com.tripguard.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationAttemptRepository notificationAttemptRepository;
    private final CompositeNotificationProvider compositeNotificationProvider;
    private final AuditService auditService;

    @Transactional
    public void sendDisruptionAlert(User user, Booking booking, FlightStatusEvent event) {
        String subject = "TripGuard Alert: Flight " + booking.getFlightNumber() + " " + event.getStatus();
        String message = buildAlertMessage(booking, event);

        if (!recentDuplicate(booking.getId(), subject)) {
            sendAndRecord(user, booking, NotificationChannel.EMAIL, user.getEmail(), subject, message);
            if (StringUtils.hasText(user.getPhoneNumber())) {
                sendAndRecord(user, booking, NotificationChannel.SMS, user.getPhoneNumber(), subject, message);
            }
        }
    }

    @Transactional
    public TestAlertResponse sendTestAlert(User user) {
        String subject = "TripGuard test alert";
        String message = "This is a test from TripGuard AI. You'll receive alerts here when a tracked flight is delayed or cancelled.";

        NotificationSendResult emailResult =
                sendAndRecord(user, null, NotificationChannel.EMAIL, user.getEmail(), subject, message);

        NotificationSendResult smsResult = null;
        if (StringUtils.hasText(user.getPhoneNumber())) {
            smsResult = sendAndRecord(
                    user, null, NotificationChannel.SMS, user.getPhoneNumber(), subject, message);
        }

        boolean emailSent = emailResult.success();
        boolean smsSent = smsResult != null && smsResult.success();

        if (!emailSent && !smsSent) {
            String detail = emailResult.errorMessage();
            if (smsResult != null && smsResult.errorMessage() != null) {
                detail = (detail != null ? detail + "; " : "") + smsResult.errorMessage();
            }
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "Test alert could not be delivered" + (detail != null ? ": " + detail : ""));
        }

        String smsDetail = smsResult == null
                ? "Add a phone number and save to enable SMS"
                : deliveryDetail(smsResult, user.getPhoneNumber());

        return new TestAlertResponse(
                buildTestMessage(user, emailSent, smsSent),
                emailSent,
                smsSent,
                deliveryDetail(emailResult, user.getEmail()),
                smsDetail);
    }

    private String buildTestMessage(User user, boolean emailSent, boolean smsSent) {
        StringBuilder sb = new StringBuilder("Test alert ");
        if (emailSent && smsSent) {
            sb.append("sent to ").append(user.getEmail()).append(" and ").append(user.getPhoneNumber());
        } else if (emailSent) {
            sb.append("sent to ").append(user.getEmail());
            if (!StringUtils.hasText(user.getPhoneNumber())) {
                sb.append(" (save a phone number for SMS)");
            }
        } else if (smsSent) {
            sb.append("sent via SMS to ").append(user.getPhoneNumber());
        }
        return sb.toString();
    }

    private String deliveryDetail(NotificationSendResult result, String recipient) {
        if (!result.success()) {
            return result.errorMessage() != null ? result.errorMessage() : "failed";
        }
        String via = "mock".equals(result.provider())
                ? "simulated (dev mode — check server logs)"
                : result.provider();
        return "Delivered to " + recipient + " via " + via;
    }

    @Transactional(readOnly = true)
    public List<NotificationAttemptResponse> getAttemptsForUser(UUID userId, UUID bookingId) {
        List<NotificationAttempt> attempts = bookingId != null
                ? notificationAttemptRepository.findByUser_IdAndBooking_IdOrderByAttemptedAtDesc(userId, bookingId)
                : notificationAttemptRepository.findByUser_IdOrderByAttemptedAtDesc(userId);
        return attempts.stream().map(this::toResponse).toList();
    }

    private boolean recentDuplicate(UUID bookingId, String subject) {
        if (bookingId == null) {
            return false;
        }
        Instant since = Instant.now().minus(30, ChronoUnit.MINUTES);
        return notificationAttemptRepository.existsByBooking_IdAndSubjectAndStatusAndAttemptedAtAfter(
                bookingId, subject, NotificationStatus.SENT, since);
    }

    private String buildAlertMessage(Booking booking, FlightStatusEvent event) {
        return "Your flight " + booking.getFlightNumber() + " from " + booking.getDepartureAirport()
                + " to " + booking.getArrivalAirport() + " is now " + event.getStatus()
                + (event.getDelayMinutes() != null && event.getDelayMinutes() > 0
                ? " (delay: " + event.getDelayMinutes() + " min)" : "")
                + ".\n\nOpen TripGuard to view the live timeline.";
    }

    private NotificationSendResult sendAndRecord(User user, Booking booking, NotificationChannel channel,
                               String recipient, String subject, String message) {
        NotificationAttempt attempt = NotificationAttempt.builder()
                .user(user)
                .booking(booking)
                .channel(channel)
                .status(NotificationStatus.PENDING)
                .recipient(recipient)
                .subject(subject)
                .message(message)
                .attemptedAt(Instant.now())
                .build();

        NotificationSendResult result =
                compositeNotificationProvider.send(channel, recipient, subject, message);

        if (result.success()) {
            attempt.setStatus(NotificationStatus.SENT);
        } else {
            attempt.setStatus(NotificationStatus.FAILED);
            attempt.setErrorMessage(result.errorMessage());
        }

        NotificationAttempt saved = notificationAttemptRepository.save(attempt);
        auditService.log(user.getId(), "NOTIFICATION_SENT", "NotificationAttempt", saved.getId().toString(),
                channel + " via " + result.provider() + " → " + saved.getStatus());
        return result;
    }

    private NotificationAttemptResponse toResponse(NotificationAttempt attempt) {
        return NotificationAttemptResponse.builder()
                .id(attempt.getId())
                .bookingId(attempt.getBooking() != null ? attempt.getBooking().getId() : null)
                .channel(attempt.getChannel())
                .status(attempt.getStatus())
                .recipient(attempt.getRecipient())
                .subject(attempt.getSubject())
                .message(attempt.getMessage())
                .attemptedAt(attempt.getAttemptedAt())
                .errorMessage(attempt.getErrorMessage())
                .build();
    }
}
