package com.tripguard.discover.service;

import com.tripguard.discover.dto.AirportResponse;
import com.tripguard.discover.dto.PopularRouteResponse;
import com.tripguard.discover.dto.WeatherResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DiscoverService {

    private final WeatherService weatherService;

    private static final List<AirportResponse> AIRPORTS = List.of(
            new AirportResponse("HEL", "Helsinki", "Finland", "Europe"),
            new AirportResponse("OUL", "Oulu", "Finland", "Europe"),
            new AirportResponse("TMP", "Tampere", "Finland", "Europe"),
            new AirportResponse("RIX", "Riga", "Latvia", "Europe"),
            new AirportResponse("TLL", "Tallinn", "Estonia", "Europe"),
            new AirportResponse("VNO", "Vilnius", "Lithuania", "Europe"),
            new AirportResponse("ARN", "Stockholm", "Sweden", "Europe"),
            new AirportResponse("CPH", "Copenhagen", "Denmark", "Europe"),
            new AirportResponse("OSL", "Oslo", "Norway", "Europe"),
            new AirportResponse("KEF", "Reykjavik", "Iceland", "Europe"),
            new AirportResponse("LHR", "London", "United Kingdom", "Europe"),
            new AirportResponse("LGW", "London Gatwick", "United Kingdom", "Europe"),
            new AirportResponse("CDG", "Paris", "France", "Europe"),
            new AirportResponse("FRA", "Frankfurt", "Germany", "Europe"),
            new AirportResponse("MUC", "Munich", "Germany", "Europe"),
            new AirportResponse("AMS", "Amsterdam", "Netherlands", "Europe"),
            new AirportResponse("BRU", "Brussels", "Belgium", "Europe"),
            new AirportResponse("MAD", "Madrid", "Spain", "Europe"),
            new AirportResponse("BCN", "Barcelona", "Spain", "Europe"),
            new AirportResponse("FCO", "Rome", "Italy", "Europe"),
            new AirportResponse("MXP", "Milan", "Italy", "Europe"),
            new AirportResponse("VIE", "Vienna", "Austria", "Europe"),
            new AirportResponse("ZRH", "Zurich", "Switzerland", "Europe"),
            new AirportResponse("WAW", "Warsaw", "Poland", "Europe"),
            new AirportResponse("PRG", "Prague", "Czechia", "Europe"),
            new AirportResponse("ATH", "Athens", "Greece", "Europe"),
            new AirportResponse("IST", "Istanbul", "Türkiye", "Europe"),
            new AirportResponse("DXB", "Dubai", "UAE", "Middle East"),
            new AirportResponse("DOH", "Doha", "Qatar", "Middle East"),
            new AirportResponse("DEL", "New Delhi", "India", "Asia"),
            new AirportResponse("HYD", "Hyderabad", "India", "Asia"),
            new AirportResponse("VGA", "Vijayawada", "India", "Asia"),
            new AirportResponse("VTZ", "Visakhapatnam", "India", "Asia"),
            new AirportResponse("KTM", "Kathmandu", "Nepal", "Asia"),
            new AirportResponse("BOM", "Mumbai", "India", "Asia"),
            new AirportResponse("BLR", "Bangalore", "India", "Asia"),
            new AirportResponse("MAA", "Chennai", "India", "Asia"),
            new AirportResponse("CCU", "Kolkata", "India", "Asia"),
            new AirportResponse("SIN", "Singapore", "Singapore", "Asia"),
            new AirportResponse("HKG", "Hong Kong", "China", "Asia"),
            new AirportResponse("PVG", "Shanghai", "China", "Asia"),
            new AirportResponse("PEK", "Beijing", "China", "Asia"),
            new AirportResponse("NRT", "Tokyo Narita", "Japan", "Asia"),
            new AirportResponse("ICN", "Seoul", "South Korea", "Asia"),
            new AirportResponse("BKK", "Bangkok", "Thailand", "Asia"),
            new AirportResponse("KUL", "Kuala Lumpur", "Malaysia", "Asia"),
            new AirportResponse("JFK", "New York JFK", "United States", "Americas"),
            new AirportResponse("EWR", "Newark", "United States", "Americas"),
            new AirportResponse("LAX", "Los Angeles", "United States", "Americas"),
            new AirportResponse("ORD", "Chicago", "United States", "Americas"),
            new AirportResponse("MIA", "Miami", "United States", "Americas"),
            new AirportResponse("YYZ", "Toronto", "Canada", "Americas"),
            new AirportResponse("YVR", "Vancouver", "Canada", "Americas"),
            new AirportResponse("GRU", "São Paulo", "Brazil", "Americas"),
            new AirportResponse("EZE", "Buenos Aires", "Argentina", "Americas"),
            new AirportResponse("SYD", "Sydney", "Australia", "Oceania"),
            new AirportResponse("MEL", "Melbourne", "Australia", "Oceania"),
            new AirportResponse("AKL", "Auckland", "New Zealand", "Oceania"),
            new AirportResponse("JNB", "Johannesburg", "South Africa", "Africa"),
            new AirportResponse("CAI", "Cairo", "Egypt", "Africa"),
            new AirportResponse("NBO", "Nairobi", "Kenya", "Africa")
    );

    private static final Map<String, List<PopularRouteResponse>> ROUTES_BY_ORIGIN = Map.ofEntries(
            Map.entry("HEL", List.of(
                    route("HEL", "Helsinki", "Finland", "LHR", "London", "United Kingdom"),
                    route("HEL", "Helsinki", "Finland", "CDG", "Paris", "France"),
                    route("HEL", "Helsinki", "Finland", "DXB", "Dubai", "UAE"),
                    route("HEL", "Helsinki", "Finland", "ARN", "Stockholm", "Sweden")
            )),
            Map.entry("HYD", List.of(
                    route("HYD", "Hyderabad", "India", "DEL", "New Delhi", "India"),
                    route("HYD", "Hyderabad", "India", "BOM", "Mumbai", "India"),
                    route("HYD", "Hyderabad", "India", "BLR", "Bangalore", "India"),
                    route("HYD", "Hyderabad", "India", "DXB", "Dubai", "UAE")
            )),
            Map.entry("VGA", List.of(
                    route("VGA", "Vijayawada", "India", "HYD", "Hyderabad", "India"),
                    route("VGA", "Vijayawada", "India", "BLR", "Bangalore", "India"),
                    route("VGA", "Vijayawada", "India", "DEL", "New Delhi", "India"),
                    route("VGA", "Vijayawada", "India", "MAA", "Chennai", "India")
            )),
            Map.entry("VTZ", List.of(
                    route("VTZ", "Visakhapatnam", "India", "HYD", "Hyderabad", "India"),
                    route("VTZ", "Visakhapatnam", "India", "DEL", "New Delhi", "India"),
                    route("VTZ", "Visakhapatnam", "India", "BLR", "Bangalore", "India"),
                    route("VTZ", "Visakhapatnam", "India", "KTM", "Kathmandu", "Nepal")
            )),
            Map.entry("BLR", List.of(
                    route("BLR", "Bangalore", "India", "DEL", "New Delhi", "India"),
                    route("BLR", "Bangalore", "India", "BOM", "Mumbai", "India"),
                    route("BLR", "Bangalore", "India", "SIN", "Singapore", "Singapore"),
                    route("BLR", "Bangalore", "India", "DXB", "Dubai", "UAE")
            )),
            Map.entry("BOM", List.of(
                    route("BOM", "Mumbai", "India", "DEL", "New Delhi", "India"),
                    route("BOM", "Mumbai", "India", "BLR", "Bangalore", "India"),
                    route("BOM", "Mumbai", "India", "DXB", "Dubai", "UAE"),
                    route("BOM", "Mumbai", "India", "LHR", "London", "United Kingdom")
            )),
            Map.entry("MAA", List.of(
                    route("MAA", "Chennai", "India", "DEL", "New Delhi", "India"),
                    route("MAA", "Chennai", "India", "BOM", "Mumbai", "India"),
                    route("MAA", "Chennai", "India", "SIN", "Singapore", "Singapore"),
                    route("MAA", "Chennai", "India", "DXB", "Dubai", "UAE")
            )),
            Map.entry("DEL", List.of(
                    route("DEL", "New Delhi", "India", "BOM", "Mumbai", "India"),
                    route("DEL", "New Delhi", "India", "BLR", "Bangalore", "India"),
                    route("DEL", "New Delhi", "India", "DXB", "Dubai", "UAE"),
                    route("DEL", "New Delhi", "India", "LHR", "London", "United Kingdom")
            )),
            Map.entry("LHR", List.of(
                    route("LHR", "London", "United Kingdom", "JFK", "New York", "United States"),
                    route("LHR", "London", "United Kingdom", "DXB", "Dubai", "UAE"),
                    route("LHR", "London", "United Kingdom", "CDG", "Paris", "France"),
                    route("LHR", "London", "United Kingdom", "HEL", "Helsinki", "Finland")
            )),
            Map.entry("JFK", List.of(
                    route("JFK", "New York", "United States", "LHR", "London", "United Kingdom"),
                    route("JFK", "New York", "United States", "CDG", "Paris", "France"),
                    route("JFK", "New York", "United States", "LAX", "Los Angeles", "United States"),
                    route("JFK", "New York", "United States", "DXB", "Dubai", "UAE")
            ))
    );

    private static final List<PopularRouteResponse> DEFAULT_ROUTES = List.of(
            route("DXB", "Dubai", "UAE", "LHR", "London", "United Kingdom"),
            route("SIN", "Singapore", "Singapore", "SYD", "Sydney", "Australia"),
            route("JFK", "New York", "United States", "LHR", "London", "United Kingdom"),
            route("DEL", "New Delhi", "India", "DXB", "Dubai", "UAE")
    );

    public List<AirportResponse> searchAirports(String query, int limit) {
        String q = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        Stream<AirportResponse> stream = AIRPORTS.stream();
        if (!q.isEmpty()) {
            stream = stream.filter(a ->
                    a.code().toLowerCase(Locale.ROOT).contains(q)
                            || a.city().toLowerCase(Locale.ROOT).contains(q)
                            || a.country().toLowerCase(Locale.ROOT).contains(q));
        }
        return stream.limit(Math.min(limit, 50)).toList();
    }

    public List<PopularRouteResponse> popularRoutes(String originCode) {
        if (originCode == null || originCode.isBlank()) {
            return DEFAULT_ROUTES;
        }
        return ROUTES_BY_ORIGIN.getOrDefault(originCode.toUpperCase(Locale.ROOT), DEFAULT_ROUTES);
    }

    public String nearestAirportCode(String countryCode) {
        if (countryCode == null || countryCode.isBlank()) {
            return "DXB";
        }
        return switch (countryCode.toUpperCase(Locale.ROOT)) {
            case "IN" -> "HYD";
            case "NP" -> "KTM";
            case "FI" -> "HEL";
            case "GB", "UK" -> "LHR";
            case "US" -> "JFK";
            case "AE" -> "DXB";
            case "SG" -> "SIN";
            case "AU" -> "SYD";
            case "DE" -> "FRA";
            case "FR" -> "CDG";
            case "SE" -> "ARN";
            case "NO" -> "OSL";
            case "DK" -> "CPH";
            case "EE" -> "TLL";
            case "LV" -> "RIX";
            case "LT" -> "VNO";
            case "ES" -> "MAD";
            case "IT" -> "FCO";
            case "NL" -> "AMS";
            case "CA" -> "YYZ";
            case "JP" -> "NRT";
            case "CN" -> "PVG";
            case "TH" -> "BKK";
            case "TR" -> "IST";
            case "ZA" -> "JNB";
            case "BR" -> "GRU";
            default -> "DXB";
        };
    }

    public WeatherResponse destinationWeather(String airportCode) {
        if (airportCode == null || airportCode.isBlank()) {
            throw new com.tripguard.common.exception.ResourceNotFoundException("Airport code required");
        }
        String code = airportCode.toUpperCase(Locale.ROOT);
        AirportResponse airport = AIRPORTS.stream()
                .filter(a -> a.code().equalsIgnoreCase(code))
                .findFirst()
                .orElse(new AirportResponse(code, code, "", ""));

        return weatherService.weatherForAirport(airport.code(), airport.city(), airport.country())
                .orElseThrow(() -> new com.tripguard.common.exception.ResourceNotFoundException(
                        "Weather not available for " + code));
    }

    private static PopularRouteResponse route(
            String originCode, String originCity, String originCountry,
            String destCode, String destCity, String destCountry) {
        return new PopularRouteResponse(
                originCode,
                originCity,
                originCountry,
                destCode,
                destCity,
                destCountry,
                imageFor(destCode),
                "Flexible dates",
                "Round-trip"
        );
    }

    private static String imageFor(String destCode) {
        return switch (destCode) {
            case "LHR" -> "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80";
            case "DXB" -> "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80";
            case "JFK" -> "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80";
            case "BKK" -> "https://images.unsplash.com/photo-1563492065-9a78e0e8e4a4?auto=format&fit=crop&w=600&q=80";
            case "SYD" -> "https://images.unsplash.com/photo-1506973035872-a4ec16b8f8b9?auto=format&fit=crop&w=600&q=80";
            case "DEL" -> "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80";
            default -> "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80";
        };
    }
}
