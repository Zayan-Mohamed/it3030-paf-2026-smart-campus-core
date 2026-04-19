package com.smartcampus.api.controller;

import com.smartcampus.api.dto.AdminDashboardResponse;
import com.smartcampus.api.dto.user.UserDto;
import com.smartcampus.api.model.Incident.IncidentStatus;
import com.smartcampus.api.repository.BookingRepository;
import com.smartcampus.api.repository.FacilityRepository;
import com.smartcampus.api.repository.IncidentRepository;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for Admin Dashboard operations.
 * 
 * SECURITY:
 * - All endpoints require authentication (JWT)
 * - Access restricted to users with ADMIN role ONLY
 * - Uses @PreAuthorize for method-level security
 * 
 * Spring Security automatically adds "ROLE_" prefix to roles from the JWT.
 * So hasRole('ADMIN') checks for "ROLE_ADMIN" in the JWT.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/dashboard/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"})
public class AdminDashboardController {
    
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final IncidentRepository incidentRepository;
    private final FacilityRepository facilityRepository;
    private final DataSource dataSource;
    
    /**
     * Get admin dashboard welcome data.
     * 
     * SECURITY: Requires ADMIN role ONLY
     * 
     * @param userDetails The authenticated user's details (injected by Spring Security)
     * @return AdminDashboardResponse with welcome message and system statistics
     */
    @GetMapping("/welcome")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getWelcomeData(
            @AuthenticationPrincipal User userDetails
    ) {
        log.info("Admin dashboard welcome request from user: {}", userDetails.getName());
        
        long totalUsers = userRepository.count();
        long activeBookings = bookingRepository.count(); // Represents total or active bookings depending on logic
        long openIncidents = incidentRepository.countByStatus(IncidentStatus.OPEN);
        long totalFacilities = facilityRepository.count();
        
        List<UserDto> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc().stream().map(u -> UserDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .roles(u.getRoles())
                .createdAt(u.getCreatedAt())
                .build()).collect(Collectors.toList());

        String dbStatus = "DOWN";
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1)) {
                dbStatus = "UP";
            }
        } catch (Exception e) {
            log.error("Database health check failed", e);
        }

        RuntimeMXBean runtimeBean = ManagementFactory.getRuntimeMXBean();
        long uptimeMs = runtimeBean.getUptime();
        long uptimeHours = uptimeMs / (1000 * 60 * 60);
        long uptimeDays = uptimeHours / 24;
        String uptimeStr = uptimeDays > 0 ? uptimeDays + " days" : uptimeHours + " hours";
        if (uptimeHours == 0) {
            uptimeStr = (uptimeMs / (1000 * 60)) + " mins";
        }

        long totalMemory = Runtime.getRuntime().totalMemory();
        long freeMemory = Runtime.getRuntime().freeMemory();
        long usedMemory = totalMemory - freeMemory;
        int memoryUsagePercentage = (int) ((usedMemory * 100.0f) / totalMemory);

        AdminDashboardResponse.SystemHealth systemHealth = AdminDashboardResponse.SystemHealth.builder()
                .status("UP")
                .database(dbStatus)
                .uptime(uptimeStr)
                .memoryUsagePercentage(memoryUsagePercentage)
                .build();
        
        AdminDashboardResponse response = AdminDashboardResponse.builder()
                .message("Welcome Admin!")
                .adminName(userDetails.getName())
                .totalUsers((int) totalUsers)
                .activeBookings((int) activeBookings)
                .openIncidents((int) openIncidents)
                .totalFacilities((int) totalFacilities)
                .recentUsers(recentUsers)
                .systemHealth(systemHealth)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get system-wide statistics.
     * 
     * SECURITY: Requires ADMIN role ONLY
     * 
     * @param userDetails The authenticated user's details
     * @return System statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getSystemStatistics(
            @AuthenticationPrincipal User userDetails
    ) {
        log.info("System statistics request from admin: {}", userDetails.getName());
        
        // Placeholder response until statistics services are wired in.
        return ResponseEntity.ok("System statistics - accessible only to admins");
    }
    
    /**
     * Get all users in the system (admin function).
     * 
     * SECURITY: Requires ADMIN role ONLY
     * 
     * @param userDetails The authenticated user's details
     * @return List of all users
     */
    @GetMapping("/users/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAllUsers(
            @AuthenticationPrincipal User userDetails
    ) {
        log.info("Get all users request from admin: {}", userDetails.getName());
        
        // Placeholder response until user administration services are wired in.
        return ResponseEntity.ok("All users - admin access only");
    }
    
    /**
     * Get system audit logs (admin function).
     * 
     * SECURITY: Requires ADMIN role ONLY
     * 
     * @param userDetails The authenticated user's details
     * @return System audit logs
     */
    @GetMapping("/audit/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAuditLogs(
            @AuthenticationPrincipal User userDetails
    ) {
        log.info("Audit logs request from admin: {}", userDetails.getName());
        
        // Placeholder response until audit services are wired in.
        return ResponseEntity.ok("Audit logs - admin access only");
    }
}
