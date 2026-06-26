package com.tripguard.discover.dto;

public record WeatherResponse(
        String airportCode,
        String city,
        String country,
        double temperatureC,
        int weatherCode,
        String condition,
        String summary,
        int humidityPercent,
        double windSpeedKmh
) {
}
