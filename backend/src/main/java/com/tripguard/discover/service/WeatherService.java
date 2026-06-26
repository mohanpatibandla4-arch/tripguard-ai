package com.tripguard.discover.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tripguard.discover.dto.WeatherResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class WeatherService {

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.open-meteo.com")
            .build();

    private static final Map<String, double[]> AIRPORT_COORDS = Map.ofEntries(
            Map.entry("DEL", new double[]{28.5562, 77.1000}),
            Map.entry("VTZ", new double[]{17.7212, 83.2245}),
            Map.entry("VGA", new double[]{16.5304, 80.7968}),
            Map.entry("HYD", new double[]{17.2403, 78.4294}),
            Map.entry("HEL", new double[]{60.3172, 24.9633}),
            Map.entry("LHR", new double[]{51.4700, -0.4543}),
            Map.entry("JFK", new double[]{40.6413, -73.7781}),
            Map.entry("DXB", new double[]{25.2532, 55.3657}),
            Map.entry("KTM", new double[]{27.6966, 85.3591}),
            Map.entry("BOM", new double[]{19.0896, 72.8656}),
            Map.entry("CDG", new double[]{49.0097, 2.5479}),
            Map.entry("FRA", new double[]{50.0379, 8.5622}),
            Map.entry("SIN", new double[]{1.3644, 103.9915})
    );

    public Optional<WeatherResponse> weatherForAirport(String airportCode, String city, String country) {
        if (airportCode == null) {
            return Optional.empty();
        }
        String code = airportCode.toUpperCase(Locale.ROOT);
        double[] coords = AIRPORT_COORDS.get(code);
        if (coords == null) {
            return Optional.empty();
        }

        try {
            OpenMeteoResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/forecast")
                            .queryParam("latitude", coords[0])
                            .queryParam("longitude", coords[1])
                            .queryParam("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m")
                            .queryParam("timezone", "auto")
                            .build())
                    .retrieve()
                    .body(OpenMeteoResponse.class);

            if (response == null || response.current == null) {
                return Optional.empty();
            }

            int wmo = response.current.weatherCode;
            String condition = wmoLabel(wmo);
            String summary = summaryFor(condition, city != null ? city : code);

            return Optional.of(new WeatherResponse(
                    code,
                    city != null ? city : code,
                    country != null ? country : "",
                    response.current.temperature2m,
                    wmo,
                    condition,
                    summary,
                    response.current.relativeHumidity2m,
                    response.current.windSpeed10m
            ));
        } catch (RestClientException ex) {
            log.warn("Weather fetch failed for {}: {}", code, ex.getMessage());
            return Optional.empty();
        }
    }

    private String summaryFor(String condition, String city) {
        return switch (condition.toLowerCase(Locale.ROOT)) {
            case "rain", "drizzle", "thunderstorm" -> "Might rain in " + city;
            case "fog", "mist" -> "Mist possible in " + city;
            case "snow" -> "Snow possible in " + city;
            default -> "Clear skies expected in " + city;
        };
    }

    private String wmoLabel(int code) {
        return switch (code) {
            case 0 -> "Clear";
            case 1, 2, 3 -> "Partly cloudy";
            case 45, 48 -> "Mist";
            case 51, 53, 55, 56, 57 -> "Drizzle";
            case 61, 63, 65, 66, 67, 80, 81, 82 -> "Rain";
            case 71, 73, 75, 77, 85, 86 -> "Snow";
            case 95, 96, 99 -> "Thunderstorm";
            default -> "Cloudy";
        };
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenMeteoResponse(Current current) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Current(
            double temperature2m,
            int relativeHumidity2m,
            int weatherCode,
            double windSpeed10m
    ) {
    }
}
