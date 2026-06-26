package com.tripguard.notification.provider;

import com.tripguard.notification.config.NotificationProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

/**
 * SMS via Twilio Programmable Messaging.
 * @see <a href="https://www.twilio.com/docs/messaging">Twilio Messaging</a>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TwilioSmsNotificationProvider {

    private final NotificationProperties properties;
    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.twilio.com")
            .build();

    public Optional<NotificationSendResult> send(String recipient, String subject, String message) {
        NotificationProperties.Sms sms = properties.getSms();
        if (!sms.isEnabled()
                || !StringUtils.hasText(sms.getAccountSid())
                || !StringUtils.hasText(sms.getAuthToken())
                || !StringUtils.hasText(sms.getFromNumber())) {
            return Optional.empty();
        }

        String to = normalizePhone(recipient);
        if (!StringUtils.hasText(to)) {
            return Optional.of(NotificationSendResult.fail("twilio", "Invalid phone number"));
        }

        String body = subject + " — " + message;
        if (body.length() > 1500) {
            body = body.substring(0, 1497) + "...";
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("To", to);
        form.add("From", sms.getFromNumber());
        form.add("Body", body);

        String auth = Base64.getEncoder().encodeToString(
                (sms.getAccountSid() + ":" + sms.getAuthToken()).getBytes(StandardCharsets.UTF_8));

        try {
            restClient.post()
                    .uri("/2010-04-01/Accounts/{sid}/Messages.json", sms.getAccountSid())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .header("Authorization", "Basic " + auth)
                    .body(form)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Twilio SMS sent to {}", to);
            return Optional.of(NotificationSendResult.ok("twilio", "twilio-" + System.currentTimeMillis()));
        } catch (RestClientException ex) {
            log.warn("Twilio SMS failed for {}: {}", to, ex.getMessage());
            return Optional.of(NotificationSendResult.fail("twilio", ex.getMessage()));
        }
    }

    private String normalizePhone(String raw) {
        if (!StringUtils.hasText(raw)) {
            return null;
        }
        String digits = raw.replaceAll("[^+\\d]", "");
        if (digits.startsWith("+")) {
            return digits;
        }
        if (digits.length() == 10) {
            return "+91" + digits;
        }
        return "+" + digits;
    }
}
