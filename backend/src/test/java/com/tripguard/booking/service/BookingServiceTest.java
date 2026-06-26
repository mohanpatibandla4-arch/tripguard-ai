package com.tripguard.booking.service;

import com.tripguard.audit.service.AuditService;
import com.tripguard.booking.dto.CreateBookingRequest;
import com.tripguard.booking.entity.Booking;
import com.tripguard.booking.repository.BookingRepository;
import com.tripguard.common.enums.BookingStatus;
import com.tripguard.common.enums.JourneyType;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void createBooking_shouldPersistBooking() {
        User user = User.builder()
                .email("user@example.com")
                .passwordHash("hash")
                .fullName("Test User")
                .build();
        user.setId(UUID.randomUUID());

        Instant departure = Instant.parse("2026-07-15T10:00:00Z");
        Instant arrival = Instant.parse("2026-07-15T18:00:00Z");

        CreateBookingRequest request = new CreateBookingRequest(
                "ba123", "lhr", "jfk", departure, arrival, "REF001", JourneyType.FLIGHT);

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(UUID.randomUUID());
            return booking;
        });

        var response = bookingService.createBooking(user, request);

        assertThat(response.getFlightNumber()).isEqualTo("BA123");
        assertThat(response.getDepartureAirport()).isEqualTo("LHR");
        assertThat(response.getStatus()).isEqualTo(BookingStatus.SCHEDULED);
        verify(auditService).log(any(), any(), any(), any(), any());
    }
}
