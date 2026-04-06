package com.smartcampus.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Staff Dashboard welcome response.
 * Contains staff-specific work queue and task information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffDashboardResponse {
    
    /**
     * Personalized welcome message for the staff member
     */
    private String message;
    
    /**
     * Staff member's full name
     */
    private String staffName;
    
    /**
     * Number of urgent incidents requiring immediate attention
     */
    private Integer urgentIncidents;
    
    /**
     * Number of tasks assigned to this staff member
     */
    private Integer assignedTasks;
    
    /**
     * Number of tasks completed today
     */
    private Integer completedToday;
    
    /**
     * Number of scheduled maintenance tasks
     */
    private Integer scheduledMaintenance;
}
