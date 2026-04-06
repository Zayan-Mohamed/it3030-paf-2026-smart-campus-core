package com.smartcampus.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    private String token;

    // Manually added constructor since Lombok is not working
    public TokenResponse(String token) {
        this.token = token;
    }
}
