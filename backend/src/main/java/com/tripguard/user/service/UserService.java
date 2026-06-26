package com.tripguard.user.service;

import com.tripguard.common.exception.ApiException;
import com.tripguard.common.exception.ConflictException;
import com.tripguard.common.exception.ResourceNotFoundException;
import com.tripguard.user.dto.UpdateProfileRequest;
import com.tripguard.user.dto.UserResponse;
import com.tripguard.user.entity.User;
import com.tripguard.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(String email, String rawPassword, String fullName, String phoneNumber) {
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already registered");
        }
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .build();
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = getById(userId);
        if (request.phoneNumber() != null) {
            user.setPhoneNumber(normalizePhone(request.phoneNumber()));
        }
        if (request.emailAlertsEnabled() != null) {
            user.setEmailAlertsEnabled(request.emailAlertsEnabled());
        }
        if (request.smsAlertsEnabled() != null) {
            user.setSmsAlertsEnabled(request.smsAlertsEnabled());
        }
        return toResponse(userRepository.save(user));
    }

    private String normalizePhone(String raw) {
        if (!StringUtils.hasText(raw)) {
            return null;
        }
        String cleaned = raw.trim().replaceAll("[\\s()-]", "");
        if (cleaned.matches("^\\+\\d{10,15}$")) {
            return cleaned;
        }
        if (cleaned.matches("^\\d{10}$")) {
            return "+91" + cleaned;
        }
        throw new ApiException(HttpStatus.BAD_REQUEST,
                "Invalid phone number. Use international format, e.g. +91 9876543210");
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(UUID userId) {
        return toResponse(getById(userId));
    }

    @Transactional(readOnly = true)
    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getTimezone(),
                user.isEmailAlertsEnabled(),
                user.isSmsAlertsEnabled()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles("USER")
                .build();
    }
}
