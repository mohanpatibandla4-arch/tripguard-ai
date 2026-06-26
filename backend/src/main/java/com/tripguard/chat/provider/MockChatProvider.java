package com.tripguard.chat.provider;

import com.tripguard.chat.dto.ChatMessageDto;
import com.tripguard.chat.dto.ChatReply;
import com.tripguard.chat.service.TravelContextService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;

@Component
@Slf4j
@RequiredArgsConstructor
public class MockChatProvider {

    private final TravelContextService travelContextService;

    public ChatReply generateReply(String message, List<ChatMessageDto> history) {
        String normalized = message.toLowerCase(Locale.ROOT).trim();
        int historySize = history != null ? history.size() : 0;
        log.info("[MOCK CHAT] message='{}' historySize={}", message, historySize);

        var flightReply = travelContextService.buildFlightSearchReply(message);
        if (flightReply.isPresent()) {
            return flightReply.get();
        }

        if (normalized.contains("delay") || normalized.contains("late")) {
            return new ChatReply("""
                    I can help with delays. Open **My trips**, select your booking, and tap **Track status**.
                    If the flight is delayed, you'll see it on the timeline and receive email/SMS alerts.
                    Tip: some flight numbers simulate a 45-minute delay in demo mode.""");
        }

        if (normalized.contains("cancel")) {
            return new ChatReply("""
                    For cancellations, track your flight from the booking detail page.
                    When status becomes CANCELLED, TripGuard logs alert attempts in the activity feed.
                    Tip: flight numbers ending in **9** simulate cancellation (e.g. AI109).""");
        }

        if (normalized.contains("alert") || normalized.contains("notification")
                || normalized.contains("sms") || normalized.contains("email")) {
            return new ChatReply("""
                    Alerts are sent automatically when a tracked flight is delayed or cancelled.
                    Add a phone number at registration to enable SMS. View delivery logs on each booking's detail page.""");
        }

        if (normalized.contains("add") && normalized.contains("booking")) {
            return new ChatReply("""
                    Tap **Add booking** in the navbar, enter airline + flight number, route, and schedule.
                    You'll land on the detail page where you can track status and view the timeline.""");
        }

        if (normalized.contains("hello") || normalized.contains("hi") || normalized.equals("hey")) {
            return new ChatReply(
                    "Hello! I'm TripGuard Assistant. Ask about routes, delays, cancellations, or say "
                            + "\"flights from Vijayawada to Finland tomorrow\" and I'll guide you.");
        }

        if (normalized.contains("thank")) {
            return new ChatReply("You're welcome! Safe travels — I'm here if you need help with your trips.");
        }

        return new ChatReply(String.format(
                "I can help with flight routes, tracking, and disruption alerts. "
                        + "Try: \"flights from %s\" or \"check delays on my booking\".",
                truncate(message, 60)));
    }

    private String truncate(String value, int max) {
        if (!StringUtils.hasText(value) || value.length() <= max) {
            return value;
        }
        return value.substring(0, max - 1) + "…";
    }
}
