package com.tripguard.flightstatus.provider;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tripguard.booking.entity.Booking;
import com.tripguard.common.enums.FlightStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

/**
 * Live aircraft state lookup via OpenSky Network (free, worldwide).
 * @see <a href="https://opensky-network.org/apidoc/rest.html">OpenSky REST API</a>
 */
@Component
@Slf4j
public class OpenSkyFlightStatusProvider {

    private final RestClient restClient;
    private final boolean enabled;

    public OpenSkyFlightStatusProvider(
            @org.springframework.beans.factory.annotation.Value("${tripguard.flight.opensky-enabled:true}") boolean enabled) {
        this.enabled = enabled;
        this.restClient = RestClient.builder()
                .baseUrl("https://opensky-network.org/api")
                .build();
    }

    public Optional<MockFlightStatusProvider.MockFlightStatusResult> fetchStatus(Booking booking) {
        if (!enabled) {
            return Optional.empty();
        }

        String callsign = booking.getFlightNumber().replace(" ", "").toUpperCase();
        try {
            OpenSkyStatesResponse response = restClient.get()
                    .uri("/states/all")
                    .retrieve()
                    .body(OpenSkyStatesResponse.class);

            if (response == null || response.states == null) {
                return Optional.empty();
            }

            for (List<Object> state : response.states) {
                if (state.size() < 17) {
                    continue;
                }
                String stateCallsign = state.get(1) != null ? state.get(1).toString().trim() : "";
                if (!stateCallsign.equalsIgnoreCase(callsign)) {
                    continue;
                }

                boolean onGround = state.get(8) instanceof Boolean b && b;
                Double velocity = toDouble(state.get(9));

                FlightStatus status = onGround ? FlightStatus.ON_TIME : FlightStatus.DEPARTED;
                int delayMinutes = 0;

                return Optional.of(MockFlightStatusProvider.MockFlightStatusResult.builder()
                        .status(status)
                        .estimatedDeparture(booking.getScheduledDeparture())
                        .estimatedArrival(booking.getScheduledArrival())
                        .delayMinutes(delayMinutes)
                        .gate(null)
                        .terminal(null)
                        .rawPayload("{\"provider\":\"opensky\",\"callsign\":\"" + stateCallsign
                                + "\",\"onGround\":" + onGround + ",\"velocity\":" + velocity + "}")
                        .fetchedAt(Instant.now())
                        .build());
            }

            log.info("OpenSky: no live state for callsign {}", callsign);
            return Optional.empty();
        } catch (RestClientException ex) {
            log.warn("OpenSky lookup failed for {}: {}", callsign, ex.getMessage());
            return Optional.empty();
        }
    }

    private Double toDouble(Object value) {
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        return null;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenSkyStatesResponse(List<List<Object>> states) {
    }
}
