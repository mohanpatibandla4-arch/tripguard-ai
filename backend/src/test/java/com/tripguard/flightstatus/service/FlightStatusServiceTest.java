package com.tripguard.flightstatus.service;

import com.tripguard.audit.service.AuditService;
import com.tripguard.booking.entity.Booking;
import com.tripguard.booking.service.BookingService;
import com.tripguard.common.enums.FlightStatus;
import com.tripguard.flightstatus.entity.FlightStatusEvent;
import com.tripguard.flightstatus.provider.CompositeFlightStatusProvider;
import com.tripguard.flightstatus.provider.MockFlightStatusProvider;
import com.tripguard.flightstatus.repository.FlightStatusEventRepository;
import com.tripguard.notification.service.NotificationService;
import com.tripguard.user.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FlightStatusServiceTest {

    @Mock
    private FlightStatusEventRepository flightStatusEventRepository;

    @Mock
    private CompositeFlightStatusProvider compositeFlightStatusProvider;

    @Mock
    private BookingService bookingService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private FlightStatusService flightStatusService;

    @Test
    void trackFlightStatus_shouldSaveEventAndNotifyOnDelay() {
        UUID bookingId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        User user = User.builder().email("user@example.com").passwordHash("h").fullName("User").build();
        user.setId(userId);

        Booking booking = Booking.builder()
                .user(user)
                .flightNumber("BA100")
                .departureAirport("LHR")
                .arrivalAirport("JFK")
                .scheduledDeparture(Instant.parse("2026-07-15T10:00:00Z"))
                .scheduledArrival(Instant.parse("2026-07-15T18:00:00Z"))
                .build();
        booking.setId(bookingId);

        MockFlightStatusProvider.MockFlightStatusResult mockResult =
                MockFlightStatusProvider.MockFlightStatusResult.builder()
                        .status(FlightStatus.DELAYED)
                        .estimatedDeparture(Instant.parse("2026-07-15T10:45:00Z"))
                        .estimatedArrival(Instant.parse("2026-07-15T18:45:00Z"))
                        .delayMinutes(45)
                        .gate("B12")
                        .terminal("2")
                        .rawPayload("{\"status\":\"DELAYED\"}")
                        .fetchedAt(Instant.now())
                        .build();

        when(bookingService.getBookingEntityForUser(bookingId, userId)).thenReturn(booking);
        when(compositeFlightStatusProvider.fetchStatus(booking)).thenReturn(mockResult);
        when(flightStatusEventRepository.save(any(FlightStatusEvent.class))).thenAnswer(invocation -> {
            FlightStatusEvent event = invocation.getArgument(0);
            event.setId(UUID.randomUUID());
            return event;
        });

        var response = flightStatusService.trackFlightStatus(bookingId, user);

        assertThat(response.getStatus()).isEqualTo(FlightStatus.DELAYED);
        assertThat(response.getDelayMinutes()).isEqualTo(45);
        verify(notificationService).sendDisruptionAlert(eq(user), eq(booking), any(FlightStatusEvent.class));
        verify(auditService).log(any(), any(), any(), any(), any());
    }
}
