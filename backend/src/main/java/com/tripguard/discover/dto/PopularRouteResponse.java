package com.tripguard.discover.dto;

public record PopularRouteResponse(
        String originCode,
        String originCity,
        String originCountry,
        String destinationCode,
        String destinationCity,
        String destinationCountry,
        String imageUrl,
        String dateHint,
        String tripType
) {
}
