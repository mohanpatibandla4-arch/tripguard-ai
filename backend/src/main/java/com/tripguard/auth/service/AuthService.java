package com.tripguard.auth.service;

import com.tripguard.auth.dto.AuthResponse;
import com.tripguard.user.dto.LoginRequest;
import com.tripguard.user.dto.RegisterRequest;
import com.tripguard.user.dto.UserResponse;
import com.tripguard.user.entity.User;
import com.tripguard.user.service.UserService;
import com.tripguard.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditService auditService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        User user = userService.register(
                request.getEmail(),
                request.getPassword(),
                request.getFullName(),
                request.getPhoneNumber());
        auditService.log(user.getId(), "USER_REGISTERED", "User", user.getId().toString(),
                "User registered successfully");
        return userService.toResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userService.getByEmail(authentication.getName());
        String token = jwtService.generateToken(user.getEmail());
        auditService.log(user.getId(), "USER_LOGIN", "User", user.getId().toString(), "User logged in");
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresInMs(jwtService.getExpirationMs())
                .build();
    }
}
