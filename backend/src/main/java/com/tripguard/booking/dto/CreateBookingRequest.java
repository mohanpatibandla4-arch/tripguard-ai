package com.tripguard.booking.dto;

import com.tripguard.common.enums.JourneyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.time.Instant;

@Value
public class CreateBookingRequest {

    @NotBlank
    @Size(max = 16)
    String flightNumber;

    @NotBlank
    @Size(min = 3, max = 3)
    String departureAirport;

    @NotBlank
    @Size(min = 3, max = 3)
    String arrivalAirport;

    @NotNull
    Instant scheduledDeparture;

    @NotNull
    Instant scheduledArrival;

    @Size(max = 64)
    String bookingReference;

    JourneyType journeyType;
}
