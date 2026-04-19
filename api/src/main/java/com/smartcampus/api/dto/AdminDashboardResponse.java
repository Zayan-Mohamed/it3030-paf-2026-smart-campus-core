package com.smartcampus.api.dto;

import com.smartcampus.api.dto.user.UserDto;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Admin Dashboard welcome response.
 * Contains system-wide statistics and administrative information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    
    /**
     * Personalized welcome message for the admin
     */
    private String message;
    
    /**
     * Admin's full name
     */
    private String adminName;
    
    /**
     * Total number of registered users in the system
     */
    private Integer totalUsers;
    
    /**
     * Number of active bookings across all users
     */
    private Integer activeBookings;
    
    /**
     * Number of open incidents requiring attention
     */
    private Integer openIncidents;
    
    /**
     * Total number of facilities in the system
     */
    private Integer totalFacilities;
    
    /**
     * Recent users
     */
    private List<UserDto> recentUsers;
    
    /**
     * System Health
     */
    private SystemHealth systemHealth;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemHealth {
        private String status;
        private String database;
        private String uptime;
        private Integer memoryUsagePercentage;
    }
}
