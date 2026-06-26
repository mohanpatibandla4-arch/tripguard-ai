package com.tripguard.discover.controller;

import com.tripguard.discover.dto.AirportResponse;
import com.tripguard.discover.dto.PopularRouteResponse;
import com.tripguard.discover.dto.WeatherResponse;
import com.tripguard.discover.service.DiscoverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/discover")
@RequiredArgsConstructor
@Tag(name = "Discover")
@SecurityRequirement(name = "bearerAuth")
public class DiscoverController {

    private final DiscoverService discoverService;

    @GetMapping("/airports")
    @Operation(summary = "Search worldwide airports")
    public List<AirportResponse> searchAirports(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "30") int limit) {
        return discoverService.searchAirports(q, limit);
    }

    @GetMapping("/popular-routes")
    @Operation(summary = "Popular routes from an origin airport (Booking.com style)")
    public List<PopularRouteResponse> popularRoutes(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String countryCode) {
        String originCode = origin;
        if ((originCode == null || originCode.isBlank()) && countryCode != null) {
            originCode = discoverService.nearestAirportCode(countryCode);
        }
        return discoverService.popularRoutes(originCode);
    }

    @GetMapping("/nearest-airport")
    @Operation(summary = "Suggest nearest hub airport from country code")
    public Map<String, String> nearestAirport(@RequestParam String countryCode) {
        String code = discoverService.nearestAirportCode(countryCode);
        return Map.of("airportCode", code);
    }

    @GetMapping("/weather")
    @Operation(summary = "Live destination weather for an airport (Open-Meteo)")
    public WeatherResponse destinationWeather(@RequestParam String airport) {
        return discoverService.destinationWeather(airport);
    }
}
