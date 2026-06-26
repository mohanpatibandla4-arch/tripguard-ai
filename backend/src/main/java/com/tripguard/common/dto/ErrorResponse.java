package com.tripguard.common.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class ErrorResponse {

    Instant timestamp;
    int status;
    String error;
    String message;
    String path;
    List<FieldErrorDetail> fieldErrors;

    @Value
    @Builder
    public static class FieldErrorDetail {
        String field;
        String message;
    }
}
