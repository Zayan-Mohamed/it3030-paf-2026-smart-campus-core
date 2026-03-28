package com.smartcampus.api.security;

import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Handler for successful OAuth2 authentication.
 * Creates or updates user in database and generates JWT token.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    
    @Value("${app.oauth2.redirect-uri:http://localhost:5173/auth/callback}")
    private String redirectUri;
    
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        
        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            try {
                // Extract user info from OAuth2 response
                String googleId = oauth2User.getAttribute("sub");
                String email = oauth2User.getAttribute("email");
                String name = oauth2User.getAttribute("name");
                String pictureUrl = oauth2User.getAttribute("picture");
                
                // Create or update user
                User user = userRepository.findByGoogleId(googleId)
                        .orElseGet(() -> createNewUser(googleId, email, name, pictureUrl));
                
                // Update last login time
                user.setLastLogin(LocalDateTime.now());
                userRepository.save(user);
                
                // Generate JWT token
                String token = jwtService.generateToken(user);
                
                // Redirect to frontend with token
                String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                        .queryParam("token", token)
                        .build()
                        .toUriString();
                
                log.info("OAuth2 authentication successful for user: {}", email);
                getRedirectStrategy().sendRedirect(request, response, targetUrl);
                
            } catch (Exception e) {
                log.error("Error during OAuth2 authentication success handling", e);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                        "Authentication succeeded but token generation failed");
            }
        } else {
            log.error("Authentication principal is not an OAuth2User");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid authentication");
        }
    }
    
    /**
     * Create a new user from OAuth2 data.
     * Default role is STUDENT - can be changed by admin later.
     */
    private User createNewUser(String googleId, String email, String name, String pictureUrl) {
        User user = User.builder()
                .googleId(googleId)
                .email(email)
                .name(name)
                .pictureUrl(pictureUrl)
                .enabled(true)
                .build();
        
        // Assign default role
        user.addRole(Role.STUDENT);
        
        log.info("Creating new user: {}", email);
        return user;
    }
}
