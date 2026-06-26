package com.tripguard.notification.controller;

import com.tripguard.common.security.SecurityUtils;
import com.tripguard.notification.config.NotificationProperties;
import com.tripguard.notification.dto.NotificationAttemptResponse;
import com.tripguard.notification.dto.NotificationConfigResponse;
import com.tripguard.notification.dto.TestAlertResponse;
import com.tripguard.notification.service.NotificationService;
import com.tripguard.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;
    private final NotificationProperties notificationProperties;

    @GetMapping
    @Operation(summary = "Get notification attempts for the logged-in user")
    public List<NotificationAttemptResponse> getMyNotifications(
            @RequestParam(required = false) UUID bookingId) {
        User user = securityUtils.getCurrentUser();
        return notificationService.getAttemptsForUser(user.getId(), bookingId);
    }

    @GetMapping("/config")
    @Operation(summary = "Notification provider configuration status")
    public NotificationConfigResponse getConfig() {
        return new NotificationConfigResponse(
                notificationProperties.getEmail().isEnabled(),
                notificationProperties.getSms().isEnabled(),
                false
        );
    }

    @PostMapping("/test")
    @Operation(summary = "Send a test email + SMS alert to your registered contacts")
    public TestAlertResponse sendTestAlert() {
        User user = securityUtils.getCurrentUser();
        return notificationService.sendTestAlert(user);
    }
}
