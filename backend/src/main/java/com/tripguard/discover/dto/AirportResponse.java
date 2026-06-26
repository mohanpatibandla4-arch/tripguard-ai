package com.tripguard.discover.dto;

public record AirportResponse(
        String code,
        String city,
        String country,
        String region
) {
}
