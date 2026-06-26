package com.tripguard.flightstatus.repository;

import com.tripguard.flightstatus.entity.FlightStatusEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FlightStatusEventRepository extends JpaRepository<FlightStatusEvent, UUID> {

    List<FlightStatusEvent> findByBookingIdOrderByFetchedAtDesc(UUID bookingId);
}
