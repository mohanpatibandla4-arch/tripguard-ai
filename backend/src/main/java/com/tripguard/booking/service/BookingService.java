package com.tripguard.booking.service;

import com.tripguard.audit.service.AuditService;
import com.tripguard.booking.dto.BookingResponse;
import com.tripguard.booking.dto.CreateBookingRequest;
import com.tripguard.booking.entity.Booking;
import com.tripguard.booking.repository.BookingRepository;
import com.tripguard.common.enums.BookingStatus;
import com.tripguard.common.enums.JourneyType;
import com.tripguard.common.exception.ResourceNotFoundException;
import com.tripguard.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AuditService auditService;

    @Transactional
    public BookingResponse createBooking(User user, CreateBookingRequest request) {
        Booking booking = Booking.builder()
                .user(user)
                .flightNumber(request.getFlightNumber().toUpperCase())
                .departureAirport(request.getDepartureAirport().toUpperCase())
                .arrivalAirport(request.getArrivalAirport().toUpperCase())
                .scheduledDeparture(request.getScheduledDeparture())
                .scheduledArrival(request.getScheduledArrival())
                .bookingReference(request.getBookingReference())
                .journeyType(request.getJourneyType() != null ? request.getJourneyType() : JourneyType.FLIGHT)
                .status(BookingStatus.SCHEDULED)
                .build();
        Booking saved = bookingRepository.save(booking);
        auditService.log(user.getId(), "BOOKING_CREATED", "Booking", saved.getId().toString(),
                "Booking created for flight " + saved.getFlightNumber());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForUser(UUID userId) {
        return bookingRepository.findByUser_IdOrderByScheduledDepartureDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingForUser(UUID bookingId, UUID userId) {
        return toResponse(getBookingEntityForUser(bookingId, userId));
    }

    @Transactional(readOnly = true)
    public Booking getBookingEntityForUser(UUID bookingId, UUID userId) {
        return bookingRepository.findByIdAndUser_Id(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .flightNumber(booking.getFlightNumber())
                .departureAirport(booking.getDepartureAirport())
                .arrivalAirport(booking.getArrivalAirport())
                .scheduledDeparture(booking.getScheduledDeparture())
                .scheduledArrival(booking.getScheduledArrival())
                .bookingReference(booking.getBookingReference())
                .journeyType(booking.getJourneyType())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
