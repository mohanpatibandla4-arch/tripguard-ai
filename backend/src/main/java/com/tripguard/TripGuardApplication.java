package com.tripguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TripGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(TripGuardApplication.class, args);
    }
}
