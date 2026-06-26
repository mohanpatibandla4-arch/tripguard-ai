package com.tripguard.booking.dto;

import com.tripguard.common.enums.BookingStatus;
import com.tripguard.common.enums.JourneyType;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class BookingResponse {

    UUID id;
    String flightNumber;
    String departureAirport;
    String arrivalAirport;
    Instant scheduledDeparture;
    Instant scheduledArrival;
    String bookingReference;
    JourneyType journeyType;
    BookingStatus status;
    Instant createdAt;
}
