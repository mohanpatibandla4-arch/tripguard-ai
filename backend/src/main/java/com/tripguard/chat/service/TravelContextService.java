package com.tripguard.chat.service;

import com.tripguard.chat.dto.ChatCardDto;
import com.tripguard.chat.dto.ChatReply;
import com.tripguard.discover.dto.AirportResponse;
import com.tripguard.discover.dto.PopularRouteResponse;
import com.tripguard.discover.service.DiscoverService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TravelContextService {

    private static final Pattern FROM_TO = Pattern.compile(
            "(?:from|leaving)\\s+([a-z\\s]+?)\\s+(?:to|→|->)\\s+([a-z\\s]+)",
            Pattern.CASE_INSENSITIVE);

    private static final Map<String, String> CITY_ALIASES = new LinkedHashMap<>();

    static {
        CITY_ALIASES.put("vijayawada", "VGA");
        CITY_ALIASES.put("hyderabad", "HYD");
        CITY_ALIASES.put("delhi", "DEL");
        CITY_ALIASES.put("new delhi", "DEL");
        CITY_ALIASES.put("mumbai", "BOM");
        CITY_ALIASES.put("bangalore", "BLR");
        CITY_ALIASES.put("bengaluru", "BLR");
        CITY_ALIASES.put("chennai", "MAA");
        CITY_ALIASES.put("helsinki", "HEL");
        CITY_ALIASES.put("finland", "HEL");
        CITY_ALIASES.put("stockholm", "ARN");
        CITY_ALIASES.put("london", "LHR");
        CITY_ALIASES.put("paris", "CDG");
        CITY_ALIASES.put("dubai", "DXB");
        CITY_ALIASES.put("singapore", "SIN");
        CITY_ALIASES.put("new york", "JFK");
        CITY_ALIASES.put("bangkok", "BKK");
        CITY_ALIASES.put("tallinn", "TLL");
        CITY_ALIASES.put("riga", "RIX");
    }

    private final DiscoverService discoverService;

    public Optional<ChatReply> buildFlightSearchReply(String message) {
        String normalized = message.toLowerCase(Locale.ROOT);
        boolean flightIntent = normalized.contains("flight")
                || normalized.contains("fly")
                || normalized.contains("route")
                || normalized.contains("travel")
                || normalized.contains("book")
                || FROM_TO.matcher(normalized).find()
                || mentionsKnownCity(normalized);

        if (!flightIntent) {
            return Optional.empty();
        }

        String originCode = resolveAirportCode(normalized, true).orElse("HYD");
        String destCode = resolveAirportCode(normalized, false).orElse(null);

        if (destCode == null) {
            destCode = inferDestination(normalized).orElse("HEL");
        }

        AirportResponse origin = findAirport(originCode).orElse(
                new AirportResponse(originCode, originCode, "", ""));

        AirportResponse dest = findAirport(destCode).orElse(
                new AirportResponse(destCode, destCode, "", ""));

        List<PopularRouteResponse> routes = discoverService.popularRoutes(originCode);
        List<ChatCardDto> cards = new ArrayList<>();

        String primaryUrl = "/bookings/new?from=" + originCode + "&to=" + destCode;
        cards.add(new ChatCardDto(
                origin.city() + " → " + dest.city(),
                "Add this route · today or tomorrow",
                imageFor(destCode),
                primaryUrl
        ));

        for (PopularRouteResponse route : routes.stream().limit(3).toList()) {
            if (route.destinationCode().equals(destCode)) {
                continue;
            }
            cards.add(new ChatCardDto(
                    route.originCity() + " → " + route.destinationCity(),
                    route.dateHint() + " · " + route.tripType(),
                    route.imageUrl(),
                    "/bookings/new?from=" + route.originCode() + "&to=" + route.destinationCode()
            ));
        }

        String timing = normalized.contains("tomorrow") ? "tomorrow"
                : normalized.contains("today") ? "today" : "your preferred dates";

        String hubHint = "India".equalsIgnoreCase(origin.country())
                ? "Hyderabad (HYD), Delhi (DEL), or Dubai (DXB) for Europe/Finland"
                : "major hubs on your continent";

        String text = """
                Here's what I found for **%s → %s** (%s).

                Most routes use **1–2 stops** via %s.

                **Suggested plan for %s:**
                1. Tap a route card below to pre-fill **Add booking**
                2. Enter airline + flight number (e.g. AI, EK, AY, LH)
                3. Use **Track status** for live OpenSky updates

                I don't have live seat inventory yet — add your booking and TripGuard will monitor delays & cancellations in real time.
                """.formatted(
                origin.city(),
                dest.city(),
                timing,
                hubHint,
                timing
        );

        return Optional.of(new ChatReply(text.trim(), cards));
    }

    private boolean mentionsKnownCity(String normalized) {
        return CITY_ALIASES.keySet().stream().anyMatch(normalized::contains);
    }

    private Optional<String> resolveAirportCode(String text, boolean origin) {
        Matcher matcher = FROM_TO.matcher(text);
        if (matcher.find()) {
            String segment = origin ? matcher.group(1) : matcher.group(2);
            return matchCity(segment.trim());
        }

        if (origin) {
            for (Map.Entry<String, String> entry : CITY_ALIASES.entrySet()) {
                if (text.contains("from " + entry.getKey()) || text.startsWith(entry.getKey())) {
                    return Optional.of(entry.getValue());
                }
            }
        } else {
            for (Map.Entry<String, String> entry : CITY_ALIASES.entrySet()) {
                if (text.contains("to " + entry.getKey()) || text.contains(entry.getKey() + " today")
                        || text.contains(entry.getKey() + " tomorrow")) {
                    return Optional.of(entry.getValue());
                }
            }
        }
        return Optional.empty();
    }

    private Optional<String> inferDestination(String text) {
        if (text.contains("finland") || text.contains("helsinki")) {
            return Optional.of("HEL");
        }
        if (text.contains("london")) {
            return Optional.of("LHR");
        }
        if (text.contains("dubai")) {
            return Optional.of("DXB");
        }
        return Optional.empty();
    }

    private Optional<String> matchCity(String phrase) {
        if (!StringUtils.hasText(phrase)) {
            return Optional.empty();
        }
        String key = phrase.toLowerCase(Locale.ROOT).trim();
        if (CITY_ALIASES.containsKey(key)) {
            return Optional.of(CITY_ALIASES.get(key));
        }
        for (Map.Entry<String, String> entry : CITY_ALIASES.entrySet()) {
            if (key.contains(entry.getKey())) {
                return Optional.of(entry.getValue());
            }
        }
        List<AirportResponse> matches = discoverService.searchAirports(phrase, 1);
        return matches.isEmpty() ? Optional.empty() : Optional.of(matches.get(0).code());
    }

    private Optional<AirportResponse> findAirport(String code) {
        return discoverService.searchAirports(code, 5).stream()
                .filter(a -> a.code().equalsIgnoreCase(code))
                .findFirst();
    }

    private String imageFor(String code) {
        return switch (code) {
            case "HEL" -> "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80";
            case "LHR" -> "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80";
            case "DXB" -> "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80";
            default -> "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80";
        };
    }
}
