package com.tripguard.notification.repository;

import com.tripguard.common.enums.NotificationStatus;
import com.tripguard.notification.entity.NotificationAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface NotificationAttemptRepository extends JpaRepository<NotificationAttempt, UUID> {

    List<NotificationAttempt> findByUser_IdOrderByAttemptedAtDesc(UUID userId);

    List<NotificationAttempt> findByUser_IdAndBooking_IdOrderByAttemptedAtDesc(UUID userId, UUID bookingId);

    boolean existsByBooking_IdAndSubjectAndStatusAndAttemptedAtAfter(
            UUID bookingId, String subject, NotificationStatus status, Instant attemptedAt);
}
