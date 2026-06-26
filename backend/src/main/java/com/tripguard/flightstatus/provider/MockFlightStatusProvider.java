package com.tripguard.flightstatus.provider;

import com.tripguard.booking.entity.Booking;
import com.tripguard.common.enums.FlightStatus;
import lombok.Builder;
import lombok.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class MockFlightStatusProvider {

    public MockFlightStatusResult fetchStatus(Booking booking) {
        String flightNumber = booking.getFlightNumber().toUpperCase();
        Instant now = Instant.now();
        Instant scheduledDep = booking.getScheduledDeparture();
        Instant scheduledArr = booking.getScheduledArrival();

        FlightStatus status;
        int delayMinutes;
        String gate;
        String terminal;

        if (flightNumber.endsWith("9") || flightNumber.endsWith("99")) {
            status = FlightStatus.CANCELLED;
            delayMinutes = 0;
            gate = null;
            terminal = null;
        } else if (flightNumber.contains("1802")) {
            status = now.isAfter(scheduledArr) ? FlightStatus.LANDED
                    : now.isAfter(scheduledDep) ? FlightStatus.DEPARTED
                    : FlightStatus.DELAYED;
            delayMinutes = 7;
            gate = "B12";
            terminal = "T2";
        } else if (flightNumber.hashCode() % 3 == 0) {
            status = FlightStatus.DELAYED;
            delayMinutes = 45;
            gate = "B12";
            terminal = "2";
        } else if (now.isAfter(scheduledArr)) {
            status = FlightStatus.LANDED;
            delayMinutes = 0;
            gate = "A4";
            terminal = "1";
        } else if (now.isAfter(scheduledDep)) {
            status = FlightStatus.DEPARTED;
            delayMinutes = 0;
            gate = "A4";
            terminal = "1";
        } else {
            status = FlightStatus.ON_TIME;
            delayMinutes = 0;
            gate = "A4";
            terminal = "1";
        }

        Instant estimatedDeparture = scheduledDep.plus(delayMinutes, ChronoUnit.MINUTES);
        Instant estimatedArrival = scheduledArr.plus(
                flightNumber.contains("1802") && now.isAfter(scheduledArr) ? -40 : delayMinutes,
                ChronoUnit.MINUTES);

        return MockFlightStatusResult.builder()
                .status(status)
                .estimatedDeparture(estimatedDeparture)
                .estimatedArrival(estimatedArrival)
                .delayMinutes(delayMinutes)
                .gate(gate)
                .terminal(terminal)
                .rawPayload("{\"provider\":\"mock\",\"flight\":\"" + flightNumber + "\",\"status\":\""
                        + status + "\"}")
                .fetchedAt(Instant.now())
                .build();
    }

    @Value
    @Builder
    public static class MockFlightStatusResult {
        FlightStatus status;
        Instant estimatedDeparture;
        Instant estimatedArrival;
        Integer delayMinutes;
        String gate;
        String terminal;
        String rawPayload;
        Instant fetchedAt;
    }
}
