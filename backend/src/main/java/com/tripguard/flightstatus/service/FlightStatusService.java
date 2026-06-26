package com.tripguard.flightstatus.service;

import com.tripguard.audit.service.AuditService;
import com.tripguard.booking.entity.Booking;
import com.tripguard.booking.service.BookingService;
import com.tripguard.common.enums.BookingStatus;
import com.tripguard.common.enums.FlightStatus;
import com.tripguard.flightstatus.dto.FlightStatusEventResponse;
import com.tripguard.flightstatus.entity.FlightStatusEvent;
import com.tripguard.flightstatus.provider.CompositeFlightStatusProvider;
import com.tripguard.flightstatus.provider.MockFlightStatusProvider;
import com.tripguard.flightstatus.repository.FlightStatusEventRepository;
import com.tripguard.notification.service.NotificationService;
import com.tripguard.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlightStatusService {

    private final FlightStatusEventRepository flightStatusEventRepository;
    private final CompositeFlightStatusProvider compositeFlightStatusProvider;
    private final BookingService bookingService;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Transactional
    public FlightStatusEventResponse trackFlightStatus(UUID bookingId, User user) {
        Booking booking = bookingService.getBookingEntityForUser(bookingId, user.getId());
        MockFlightStatusProvider.MockFlightStatusResult mockResult = compositeFlightStatusProvider.fetchStatus(booking);

        FlightStatusEvent event = FlightStatusEvent.builder()
                .booking(booking)
                .status(mockResult.getStatus())
                .estimatedDeparture(mockResult.getEstimatedDeparture())
                .estimatedArrival(mockResult.getEstimatedArrival())
                .delayMinutes(mockResult.getDelayMinutes())
                .gate(mockResult.getGate())
                .terminal(mockResult.getTerminal())
                .rawPayload(mockResult.getRawPayload())
                .fetchedAt(mockResult.getFetchedAt())
                .build();

        FlightStatusEvent saved = flightStatusEventRepository.save(event);
        updateBookingStatus(booking, mockResult.getStatus());

        if (mockResult.getStatus() == FlightStatus.DELAYED || mockResult.getStatus() == FlightStatus.CANCELLED) {
            notificationService.sendDisruptionAlert(user, booking, saved);
        }

        auditService.log(user.getId(), "FLIGHT_STATUS_TRACKED", "Booking", booking.getId().toString(),
                "Status tracked: " + mockResult.getStatus());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<FlightStatusEventResponse> getStatusEvents(UUID bookingId, User user) {
        bookingService.getBookingEntityForUser(bookingId, user.getId());
        return flightStatusEventRepository.findByBookingIdOrderByFetchedAtDesc(bookingId).stream()
                .map(this::toResponse)
                .toList();
    }

    private void updateBookingStatus(Booking booking, FlightStatus flightStatus) {
        if (flightStatus == FlightStatus.CANCELLED) {
            booking.setStatus(BookingStatus.CANCELLED);
        } else if (flightStatus == FlightStatus.DELAYED) {
            booking.setStatus(BookingStatus.ACTIVE);
        }
    }

    private FlightStatusEventResponse toResponse(FlightStatusEvent event) {
        return FlightStatusEventResponse.builder()
                .id(event.getId())
                .bookingId(event.getBooking().getId())
                .status(event.getStatus())
                .estimatedDeparture(event.getEstimatedDeparture())
                .estimatedArrival(event.getEstimatedArrival())
                .delayMinutes(event.getDelayMinutes())
                .gate(event.getGate())
                .terminal(event.getTerminal())
                .fetchedAt(event.getFetchedAt())
                .build();
    }
}
