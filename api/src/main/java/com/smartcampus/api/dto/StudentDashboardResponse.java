package com.smartcampus.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Student Dashboard welcome response.
 * Contains personalized welcome message and basic student statistics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardResponse {
    
    /**
     * Personalized welcome message for the student
     */
    private String message;
    
    /**
     * Student's full name
     */
    private String studentName;
    
    /**
     * Number of active bookings
     */
    private Integer activeBookings;
    
    /**
     * Number of reported incidents
     */
    private Integer reportedIncidents;
    
    /**
     * Number of available facilities
     */
    private Integer availableFacilities;
}
