package com.tripguard.booking.repository;

import com.tripguard.booking.entity.Booking;
import com.tripguard.common.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByUser_IdOrderByScheduledDepartureDesc(UUID userId);

    Optional<Booking> findByIdAndUser_Id(UUID id, UUID userId);

    List<Booking> findByStatusIn(Collection<BookingStatus> statuses);
}
