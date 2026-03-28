package com.smartcampus.api.service;

import com.smartcampus.api.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for generating and validating JWT tokens.
 * Uses JJWT library with modern API (0.12.x).
 * 
 * Security considerations:
 * - Uses HMAC-SHA-256 for token signing
 * - Secret key is read from environment variables (never hardcoded)
 * - Tokens include expiration time
 * - Validation checks signature and expiration
 */
@Service
@Slf4j
public class JwtService {
    
    private final SecretKey secretKey;
    private final long expirationMs;
    
    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        // Create SecretKey from the configured secret
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
        log.info("JwtService initialized with token expiration: {} ms", expirationMs);
    }
    
    /**
     * Generate JWT token for authenticated user.
     * Includes user ID, email, and roles as claims.
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);
        
        List<String> roles = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toList());
        
        String token = Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("name", user.getName())
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
        
        // Never log the actual token - security risk
        log.debug("Generated JWT for user: {}", user.getEmail());
        return token;
    }
    
    /**
     * Extract all claims from JWT token.
     * Validates signature and expiration.
     */
    public Claims extractClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Extract email (subject) from JWT token
     */
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }
    
    /**
     * Extract user ID from JWT token
     */
    public Long extractUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }
    
    /**
     * Extract roles from JWT token
     */
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractClaims(token).get("roles", List.class);
    }
    
    /**
     * Validate JWT token.
     * Checks signature and expiration.
     */
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = extractClaims(token).getExpiration();
            return expiration.before(new Date());
        } catch (JwtException e) {
            return true;
        }
    }
}
