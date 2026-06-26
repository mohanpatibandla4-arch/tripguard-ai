package com.tripguard.auth.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {

    String accessToken;
    String tokenType;
    long expiresInMs;
}
