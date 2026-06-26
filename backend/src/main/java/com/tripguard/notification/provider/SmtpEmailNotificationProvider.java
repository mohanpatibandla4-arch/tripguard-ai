package com.tripguard.notification.provider;

import com.tripguard.common.enums.NotificationChannel;
import com.tripguard.notification.config.NotificationProperties;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class SmtpEmailNotificationProvider {

    private final ObjectProvider<JavaMailSender> mailSender;
    private final NotificationProperties properties;

    public Optional<NotificationSendResult> send(String recipient, String subject, String message) {
        if (!properties.getEmail().isEnabled() || mailSender.getIfAvailable() == null) {
            return Optional.empty();
        }
        if (!StringUtils.hasText(recipient)) {
            return Optional.of(NotificationSendResult.fail("smtp", "Missing email recipient"));
        }

        try {
            MimeMessage mime = mailSender.getObject().createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(buildHtml(message), message);
            helper.setFrom(properties.getEmail().getFrom());
            mailSender.getObject().send(mime);
            log.info("Email sent to {}", recipient);
            return Optional.of(NotificationSendResult.ok("smtp", "email-" + System.currentTimeMillis()));
        } catch (Exception ex) {
            log.warn("SMTP send failed for {}: {}", recipient, ex.getMessage());
            return Optional.of(NotificationSendResult.fail("smtp", ex.getMessage()));
        }
    }

    private String buildHtml(String plain) {
        String body = plain.replace("\n", "<br/>");
        return """
                <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
                  <div style="background:linear-gradient(135deg,#003399,#0a1628);color:#fff;padding:16px 20px;border-radius:12px 12px 0 0;">
                    <strong>TripGuard AI</strong><br/><span style="font-size:13px;opacity:0.9;">Flight status alert</span>
                  </div>
                  <div style="border:1px solid #e5e7eb;border-top:0;padding:20px;border-radius:0 0 12px 12px;">
                    <p style="margin:0;line-height:1.6;color:#1f2937;">%s</p>
                  </div>
                </div>
                """.formatted(body);
    }
}
