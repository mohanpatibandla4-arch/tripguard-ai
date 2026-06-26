package com.tripguard.booking.controller;

import com.tripguard.booking.dto.BookingResponse;
import com.tripguard.booking.dto.CreateBookingRequest;
import com.tripguard.booking.service.BookingService;
import com.tripguard.common.security.SecurityUtils;
import com.tripguard.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a travel booking")
    public BookingResponse createBooking(@Valid @RequestBody CreateBookingRequest request) {
        User user = securityUtils.getCurrentUser();
        return bookingService.createBooking(user, request);
    }

    @GetMapping
    @Operation(summary = "Get bookings for the logged-in user")
    public List<BookingResponse> getMyBookings() {
        User user = securityUtils.getCurrentUser();
        return bookingService.getBookingsForUser(user.getId());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single booking by id")
    public BookingResponse getBooking(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();
        return bookingService.getBookingForUser(id, user.getId());
    }
}
