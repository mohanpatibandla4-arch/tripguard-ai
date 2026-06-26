package com.tripguard.chat.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "tripguard.openai")
@Getter
@Setter
public class OpenAiProperties {

    private String apiKey = "";
    private String model = "gpt-5o-mini";
    private boolean enabled = true;
}
