package com.tripguard.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Value;

@Value
public class LoginRequest {

    @NotBlank
    @Email
    String email;

    @NotBlank
    String password;
}
