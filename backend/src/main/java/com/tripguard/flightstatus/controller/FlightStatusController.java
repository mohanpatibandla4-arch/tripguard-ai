package com.tripguard.flightstatus.controller;

import com.tripguard.common.security.SecurityUtils;
import com.tripguard.flightstatus.dto.FlightStatusEventResponse;
import com.tripguard.flightstatus.service.FlightStatusService;
import com.tripguard.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bookings/{bookingId}/flight-status")
@RequiredArgsConstructor
@Tag(name = "Flight Status")
@SecurityRequirement(name = "bearerAuth")
public class FlightStatusController {

    private final FlightStatusService flightStatusService;
    private final SecurityUtils securityUtils;

    @PostMapping("/track")
    @Operation(summary = "Track flight status using mock provider and save event")
    public FlightStatusEventResponse trackStatus(@PathVariable UUID bookingId) {
        User user = securityUtils.getCurrentUser();
        return flightStatusService.trackFlightStatus(bookingId, user);
    }

    @GetMapping("/events")
    @Operation(summary = "Get saved flight status events for a booking")
    public List<FlightStatusEventResponse> getStatusEvents(@PathVariable UUID bookingId) {
        User user = securityUtils.getCurrentUser();
        return flightStatusService.getStatusEvents(bookingId, user);
    }
}
