package com.tripguard.flightstatus.scheduler;

import com.tripguard.booking.entity.Booking;
import com.tripguard.booking.repository.BookingRepository;
import com.tripguard.common.enums.BookingStatus;
import com.tripguard.flightstatus.service.FlightStatusService;
import com.tripguard.notification.config.NotificationProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class FlightStatusMonitorJob {

    private final BookingRepository bookingRepository;
    private final FlightStatusService flightStatusService;
    private final NotificationProperties notificationProperties;

    @Scheduled(fixedDelayString = "${tripguard.notifications.monitor.interval-ms:300000}")
    @Transactional
    public void pollActiveBookings() {
        if (!notificationProperties.getMonitor().isEnabled()) {
            return;
        }

        List<Booking> active = bookingRepository.findByStatusIn(
                List.of(BookingStatus.SCHEDULED, BookingStatus.ACTIVE));

        if (active.isEmpty()) {
            return;
        }

        log.info("Monitoring {} active bookings for status changes", active.size());
        for (Booking booking : active) {
            try {
                flightStatusService.trackFlightStatus(booking.getId(), booking.getUser());
            } catch (Exception ex) {
                log.warn("Status poll failed for booking {}: {}", booking.getId(), ex.getMessage());
            }
        }
    }
}
