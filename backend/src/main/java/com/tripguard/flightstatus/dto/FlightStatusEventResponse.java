package com.tripguard.flightstatus.dto;

import com.tripguard.common.enums.FlightStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class FlightStatusEventResponse {

    UUID id;
    UUID bookingId;
    FlightStatus status;
    Instant estimatedDeparture;
    Instant estimatedArrival;
    Integer delayMinutes;
    String gate;
    String terminal;
    Instant fetchedAt;
}
