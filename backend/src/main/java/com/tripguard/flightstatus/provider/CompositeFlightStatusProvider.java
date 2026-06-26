package com.tripguard.flightstatus.provider;

import com.tripguard.booking.entity.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompositeFlightStatusProvider {

    private final OpenSkyFlightStatusProvider openSkyFlightStatusProvider;
    private final MockFlightStatusProvider mockFlightStatusProvider;

    public MockFlightStatusProvider.MockFlightStatusResult fetchStatus(Booking booking) {
        return openSkyFlightStatusProvider.fetchStatus(booking)
                .orElseGet(() -> mockFlightStatusProvider.fetchStatus(booking));
    }
}
