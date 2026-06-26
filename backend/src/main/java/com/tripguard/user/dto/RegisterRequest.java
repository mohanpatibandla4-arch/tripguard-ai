package com.tripguard.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class RegisterRequest {

    @NotBlank
    @Email
    String email;

    @NotBlank
    @Size(min = 8, max = 100)
    String password;

    @NotBlank
    @Size(max = 255)
    String fullName;

    @Size(max = 32)
    String phoneNumber;
}
