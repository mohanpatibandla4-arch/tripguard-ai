package com.tripguard.booking.entity;

import com.tripguard.common.entity.BaseEntity;
import com.tripguard.common.enums.BookingStatus;
import com.tripguard.common.enums.JourneyType;
import com.tripguard.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 16)
    private String flightNumber;

    @Column(nullable = false, length = 3)
    private String departureAirport;

    @Column(nullable = false, length = 3)
    private String arrivalAirport;

    @Column(nullable = false)
    private Instant scheduledDeparture;

    @Column(nullable = false)
    private Instant scheduledArrival;

    @Column(length = 64)
    private String bookingReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JourneyType journeyType = JourneyType.FLIGHT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.SCHEDULED;
}
