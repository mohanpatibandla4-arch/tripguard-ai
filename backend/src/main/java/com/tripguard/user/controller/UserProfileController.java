package com.tripguard.user.controller;

import com.tripguard.common.security.SecurityUtils;
import com.tripguard.user.dto.UpdateProfileRequest;
import com.tripguard.user.dto.UserResponse;
import com.tripguard.user.entity.User;
import com.tripguard.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
@Tag(name = "Users")
@SecurityRequirement(name = "bearerAuth")
public class UserProfileController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping
    @Operation(summary = "Get current user profile")
    public UserResponse getProfile() {
        User user = securityUtils.getCurrentUser();
        return userService.getProfile(user.getId());
    }

    @PatchMapping
    @Operation(summary = "Update profile and alert preferences")
    public UserResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User user = securityUtils.getCurrentUser();
        return userService.updateProfile(user.getId(), request);
    }
}
