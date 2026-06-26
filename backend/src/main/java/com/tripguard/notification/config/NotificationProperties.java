package com.tripguard.notification.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "tripguard.notifications")
@Getter
@Setter
public class NotificationProperties {

    private Email email = new Email();
    private Sms sms = new Sms();
    private Monitor monitor = new Monitor();

    @Getter
    @Setter
    public static class Email {
        private boolean enabled = false;
        private String from = "TripGuard AI <alerts@tripguard.ai>";
    }

    @Getter
    @Setter
    public static class Sms {
        private boolean enabled = false;
        private String accountSid = "";
        private String authToken = "";
        private String fromNumber = "";
    }

    @Getter
    @Setter
    public static class Monitor {
        /** Poll active bookings every N minutes for status changes */
        private boolean enabled = true;
        private int intervalMinutes = 5;
    }
}
